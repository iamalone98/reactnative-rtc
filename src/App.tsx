import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';
import Toast from 'react-native-toast-message';
import { registerGlobals } from 'react-native-webrtc';
import { initAppEnv } from './modules';
import { Navigator } from './navigator/Navigator';

registerGlobals();

const containerStyle: ViewStyle = {
  flex: 1,
  backgroundColor: '#1f1c1d',
  justifyContent: 'center',
  alignItems: 'center',
};

export const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await initAppEnv();

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={containerStyle}>
        <ActivityIndicator size="large" color="#EB2F3D" />
      </View>
    );
  }

  return (
    <>
      <Navigator />
      <Toast />
    </>
  );
};
