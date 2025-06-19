import { Platform } from 'react-native';
import { check, PERMISSIONS, request } from 'react-native-permissions';

export class PermissionsModule {
  readonly platform = Platform.OS;

  constructor() {}

  async canShowModalOpenSettings() {}

  async checkVideoPermissions() {
    if (this.platform === 'ios') {
      return await check(PERMISSIONS.IOS.CAMERA);
    }

    if (this.platform === 'android') {
      return await check(PERMISSIONS.ANDROID.CAMERA);
    }

    return null;
  }

  async requestVideoPermissions() {
    if (this.platform === 'ios') {
      request(PERMISSIONS.IOS.CAMERA);
    }

    if (this.platform === 'android') {
      request(PERMISSIONS.ANDROID.CAMERA);
    }
  }

  async requestAudioPermission() {}
}
