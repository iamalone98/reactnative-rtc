import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: undefined;
  RoomJoinScreen: undefined;
  RoomScreen: { roomId: string };
};

export type RoomScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RoomScreen'
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
