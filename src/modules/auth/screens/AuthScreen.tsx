import { useState } from 'react';
import {
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppEnv } from '../..';

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

const inputMarginBottomStyle: TextStyle = {
  ...inputStyle,
  marginBottom: 14,
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

export const AuthScreen = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('12345678');
  const { login } = AppEnv.useAuthStore();

  const onSignIn = () => {
    login();
  };

  return (
    <SafeAreaView style={roomStyle}>
      <TextInput
        style={inputMarginBottomStyle}
        value={email}
        onChangeText={e => setEmail(e)}
        placeholder="admin@gmail.com"
        placeholderTextColor={'#575757'}
      />
      <TextInput
        secureTextEntry
        style={inputStyle}
        value={password}
        onChangeText={e => setPassword(e)}
        placeholder="12345678"
        placeholderTextColor={'#575757'}
      />
      <TouchableOpacity style={buttonStyle} onPress={onSignIn}>
        <Text style={buttonTextStyle}>Sign in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
