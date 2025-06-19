import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaStream, RTCView } from 'react-native-webrtc';
import { AppEnv } from '../..';
import { RoomScreenProps } from '../../../navigator/types';

const roomStyle: ViewStyle = {
  flex: 1,
  paddingHorizontal: 10,
  backgroundColor: '#1f1c1d',
};

const centerStyle: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};

const videoContainerStyle: ViewStyle = {
  height: '100%',
  width: '100%',
  backgroundColor: 'black',
  borderRadius: 10,
  position: 'relative',
  overflow: 'hidden',
};

const myVideoStreamStyle: ViewStyle = {
  flex: 1,
  width: '20%',
  height: '20%',
  position: 'absolute',
  bottom: 0,
  right: 0,
};

const backButtonStyle: ViewStyle = {
  height: 40,
  width: 40,
  borderRadius: 20,
  backgroundColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 10,
  left: 10,
  opacity: 0.3,
};

export const RoomScreen = ({ route }: RoomScreenProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const { roomId } = route.params;
  const loading = false;

  useEffect(() => {
    AppEnv.rtcClient.init(
      roomId,
      consumer => {
        const newStream = new MediaStream([consumer.track]);

        setStream(newStream);
      },
      newStream => {
        console.log(newStream);
        setMyStream(newStream);
      },
    );

    return () => {
      AppEnv.rtcClient.close();
    };
  }, [roomId]);

  const navigation = useNavigation();

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={roomStyle}>
      {loading ? (
        <View style={centerStyle}>
          <ActivityIndicator size="large" color="#EB2F3D" />
        </View>
      ) : (
        <>
          <View style={videoContainerStyle}>
            <RTCView
              style={{ flex: 1 }}
              objectFit="cover"
              streamURL={stream?.toURL()}
            />

            <RTCView
              style={myVideoStreamStyle}
              objectFit="cover"
              streamURL={myStream?.toURL()}
            />
            <TouchableOpacity style={backButtonStyle} onPress={onBack}>
              <Text>Back</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
