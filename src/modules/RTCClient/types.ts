import * as mediasoupClient from 'mediasoup-client';
import { MediaStream } from 'react-native-webrtc';

export type OnNewCosumer = (consumer: mediasoupClient.types.Consumer) => void;
export type OnMyStream = (stream: MediaStream) => void;
