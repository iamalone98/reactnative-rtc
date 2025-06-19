import { ApiModule } from './api/apiModule';
import { createAuthModule } from './auth';
import { PermissionsModule } from './permissions/permissionsModule';
import { RTCClientModule } from './RTCClient/RTCClientModule';

export { AuthScreen } from './auth';
export { RoomJoinScreen, RoomScreen } from './room';

export let AppEnv: Awaited<ReturnType<typeof initModules>>;

export const initAppEnv = async () => {
  const env = await initModules();

  AppEnv = env;
};

const initModules = async () => {
  const api = new ApiModule('https://pokeapi.co/api/v2');
  const permissions = new PermissionsModule();
  const rtcClient = new RTCClientModule();
  const { useAuthStore } = await createAuthModule({ apiModule: api });

  return {
    permissions,
    rtcClient,
    useAuthStore,
  };
};
