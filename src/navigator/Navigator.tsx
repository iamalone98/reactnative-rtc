import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AppEnv, AuthScreen, RoomJoinScreen, RoomScreen } from '../modules';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const Navigator = () => {
  const { token } = AppEnv.useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="RoomJoinScreen"
              component={RoomJoinScreen}
              options={screenOptions}
            />
            <Stack.Screen
              name="RoomScreen"
              component={RoomScreen}
              options={screenOptions}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
