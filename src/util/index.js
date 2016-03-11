import Promisify from 'tiny-promisify';

import { NativeModules } from 'react-native';
const { FBLoginManager } = NativeModules;

export async function loginWithPermissions(permissions = []) {
  return Promisify(FBLoginManager.loginWithPermissions)(permissions);
}

export async function loginWithoutPermissions() {
  return Promisify(FBLoginManager.login)();
}

export async function getFBCredentials() {
  return Promisify(FBLoginManager.getCredentials)();
}

export async function logout() {
  return Promisify(FBLoginManager.logout)();
}

export async function login(permissions = false) {
  return  (permissions) ? await loginWithPermissions(permissions) : await loginWithoutPermissions();
}