import * as mediasoupClient from 'mediasoup-client';
import { Transport } from 'mediasoup-client/types';
import protooClient, {
  Peer,
  ProtooRequest,
  ProtooResponse,
  WebSocketTransport,
} from 'protoo-client';
import { mediaDevices } from 'react-native-webrtc';
import { OnMyStream, OnNewCosumer } from './types';

export class RTCClientModule {
  private protoClient?: protooClient.WebSocketTransport;
  private protoTransport?: protooClient.Peer;
  private mediasoupDevice?: mediasoupClient.types.Device;
  private recvTransport?: Transport;
  private sendTransport?: Transport;

  private onNewConsumer?: OnNewCosumer;
  private onMyStream?: OnMyStream;

  constructor() {
    this.init = this.init.bind(this);
    this.close = this.close.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onRequest = this.onRequest.bind(this);
  }

  async init(
    roomId: string,
    onNewConsumer: OnNewCosumer,
    onMyStream: OnMyStream,
  ) {
    if (this.protoClient && this.protoTransport) {
      return;
    }

    this.onNewConsumer = onNewConsumer;
    this.onMyStream = onMyStream;

    this.protoClient = new WebSocketTransport(
      `wss://v3demo.mediasoup.org:4443/?roomId=${roomId}&peerId=1`,
    );

    this.protoTransport = new Peer(this.protoClient);

    this.protoTransport.on('request', async (request, accept, reject) => {
      if (request.method === 'newConsumer' && this.recvTransport) {
        try {
          const { id, producerId, kind, rtpParameters, appData } = request.data;

          const consumer = await this.recvTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
            appData,
          });

          console.log('✅ Consumer создан:', consumer);

          this.onNewConsumer?.(consumer);

          accept();
        } catch (err: any) {
          console.error('❌ Ошибка в newConsumer:', err);
          reject(500, err.toString());
        }
      } else {
        console.log('⚠️ Неизвестный request:', request.method);
        reject(500, 'Unknown request');
      }
    });
    this.protoTransport.on('open', async () => {
      if (!this.protoTransport) return;

      this.mediasoupDevice = await mediasoupClient.Device.factory({
        handlerName: 'ReactNativeUnifiedPlan',
      });

      const routerRtpCapabilities = await this.protoTransport.request(
        'getRouterRtpCapabilities',
      );

      await this.mediasoupDevice.load({
        routerRtpCapabilities,
        preferLocalCodecsOrder: true,
      });

      const { peers } = await this.protoTransport.request('join', {
        displayName: 'react native app',
        device: {
          flag: 'react-native',
          name: 'ReactNative',
          version: '0.1',
        },
        rtpCapabilities: this.mediasoupDevice.rtpCapabilities,
        sctpCapabilities: this.mediasoupDevice.sctpCapabilities,
      });

      const recvTransportInfo = await this.protoTransport.request(
        'createWebRtcTransport',
        {
          forceTcp: false,
          producing: false,
          consuming: true,
        },
      );

      const {
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
      } = recvTransportInfo;

      this.recvTransport = this.mediasoupDevice.createRecvTransport({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters: {
          ...dtlsParameters,
          role: 'auto',
        },
        sctpParameters,
        iceServers: [],
      });

      this.recvTransport.on(
        'connect',
        ({ dtlsParameters }, callback, errback) => {
          this.protoTransport!.request('connectWebRtcTransport', {
            transportId: this.recvTransport!.id,
            dtlsParameters,
          })
            .then(callback)
            .catch(errback);
        },
      );

      const sendTransportInfo = await this.protoTransport.request(
        'createWebRtcTransport',
        {
          forceTcp: false,
          producing: true,
          consuming: false,
        },
      );

      const {
        id: sendId,
        iceParameters: sendIceParameters,
        iceCandidates: sendIceCandidates,
        dtlsParameters: sendDtlsParameters,
        sctpParameters: sendSctpParameters,
      } = sendTransportInfo;

      this.sendTransport = this.mediasoupDevice.createSendTransport({
        id: sendId,
        iceParameters: sendIceParameters,
        iceCandidates: sendIceCandidates,
        dtlsParameters: {
          ...sendDtlsParameters,
          role: 'auto',
        },
        sctpParameters: sendSctpParameters,
        iceServers: [],
      });

      this.sendTransport.on(
        'connect',
        ({ dtlsParameters }, callback, errback) => {
          this.protoTransport!.request('connectWebRtcTransport', {
            transportId: this.sendTransport!.id,
            dtlsParameters,
          })
            .then(callback)
            .catch(errback);
        },
      );

      this.sendTransport.on(
        'produce',
        async ({ kind, rtpParameters, appData }, callback, errback) => {
          try {
            const { id } = await this.protoTransport!.request('produce', {
              transportId: this.sendTransport!.id,
              kind,
              rtpParameters,
              appData,
            });
            callback({ id });
          } catch (error) {
            errback(error as Error);
          }
        },
      );

      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      this.onMyStream?.(stream);

      for (const track of stream.getTracks()) {
        await this.sendTransport.produce({ track });
      }

      console.log('🧑‍🤝‍🧑 Joined with peers:', peers);
    });

    this.protoTransport.on('notification', async n => {
      console.log('notification', n);
    });
  }

  async close() {
    if (this.protoClient) {
      this.protoClient.close();
    }

    if (this.protoTransport) {
      this.protoTransport.close();
    }

    if (this.recvTransport) {
      this.recvTransport.close();
    }
  }

  async onOpen() {
    if (!this.protoTransport) {
      return;
    }

    this.mediasoupDevice = await mediasoupClient.Device.factory({
      handlerName: 'ReactNativeUnifiedPlan',
    });

    const routerRtpCapabilities = await this.protoTransport.request(
      'getRouterRtpCapabilities',
    );

    await this.mediasoupDevice.load({
      routerRtpCapabilities,
      preferLocalCodecsOrder: true,
    });

    const transportInfo = await this.protoTransport.request(
      'createWebRtcTransport',
      {
        forceTcp: false,
        producing: false,
        consuming: true,
      },
    );

    const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } =
      transportInfo;

    this.recvTransport = this.mediasoupDevice.createRecvTransport({
      id,
      iceParameters,
      iceCandidates,
      dtlsParameters: {
        ...dtlsParameters,
        role: 'auto',
      },
      sctpParameters,
      iceServers: [],
    });

    this.recvTransport.on('connect', (_, callback, errback) => {
      if (!this.protoTransport || !this.recvTransport) {
        return;
      }

      this.protoTransport
        .request('connectWebRtcTransport', {
          transportId: this.recvTransport.id,
          dtlsParameters,
        })
        .then(callback)
        .catch(errback);
    });

    const { peers } = await this.protoTransport.request('join', {
      displayName: 'kavo',
      device: {
        flag: 'react-native',
        name: 'ReactNative',
        version: '0.1',
      },
      rtpCapabilities: this.mediasoupDevice.rtpCapabilities,
      sctpCapabilities: this.mediasoupDevice.sctpCapabilities,
    });

    console.log('🧑‍🤝‍🧑 Joined with peers:', peers);
  }

  async onRequest(
    request: ProtooRequest,
    accept: (data?: ProtooResponse) => void,
    reject: (error?: Error | number, errorReason?: string) => void,
  ) {
    if (request.method === 'newConsumer' && this.recvTransport) {
      try {
        const { id, producerId, kind, rtpParameters, appData } = request.data;

        const consumer = await this.recvTransport.consume({
          id,
          producerId,
          kind,
          rtpParameters,
          appData,
        });

        console.log('✅ Consumer создан:', consumer);

        this.onNewConsumer?.(consumer);

        accept();
      } catch (err: any) {
        console.error('❌ Ошибка в newConsumer:', err);
        reject(500, err.toString());
      }
    } else {
      console.log('⚠️ Неизвестный request:', request.method);
      reject(500, 'Unknown request');
    }
  }
}
