import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const roomStyle: ViewStyle = {
  flex: 1,
  paddingHorizontal: 26,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#1f1c1d',
};

const inputStyle: TextStyle = {
  color: 'white',
  borderColor: '#2A2A2A',
  borderWidth: 1,
  borderRadius: 26,
  paddingVertical: 14,
  paddingHorizontal: 15,
  width: '100%',
  textAlign: 'center',
};

const buttonStyle: ViewStyle = {
  marginTop: 28,
  paddingVertical: 13,
  borderRadius: 26,
  backgroundColor: '#EB2F3D',
  width: '100%',
  alignItems: 'center',
};

const buttonTextStyle: TextStyle = {
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: 0.5,
  color: 'white',
};

export const RoomJoinScreen = () => {
  const navigation = useNavigation();
  const [roomId, setRoomId] = useState('');

  const onJoinInRoom = () => {
    if (!roomId.trim().length) {
      Toast.show({
        type: 'error',
        text1: 'RoomID is required',
      });

      return;
    }

    navigation.navigate('RoomScreen', {
      roomId,
    });
  };

  return (
    <SafeAreaView style={roomStyle}>
      <TextInput
        style={inputStyle}
        value={roomId}
        onChangeText={e => setRoomId(e)}
        placeholder="room id"
        placeholderTextColor={'#575757'}
      />
      <TouchableOpacity style={buttonStyle} onPress={onJoinInRoom}>
        <Text style={buttonTextStyle}>Join in room</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
