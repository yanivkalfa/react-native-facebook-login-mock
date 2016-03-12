import promisify from 'tiny-promisify';
import { NativeModules } from 'react-native';
const { FBLoginManager } = NativeModules;

const getCredentialsAsync = promisify(FBLoginManager.getCredentials);
const loginWithPermissionsAsync = promisify(FBLoginManager.loginWithPermissions);
const loginAsync = promisify(FBLoginManager.login);
const logoutAsync = promisify(FBLoginManager.logout);

export async function getFBCredentials() {
  return await getCredentialsAsync();
}

export async function loginWithPermissions(permissions = []) {
  return await loginWithPermissionsAsync(permissions);
}

export async function loginWithoutPermissions() {
  return await loginAsync();
}

export async function logout() {
  return await logoutAsync();
}

export async function login(permissions = false) {
  return (permissions) ? await loginWithPermissions(permissions) : await loginWithoutPermissions();
}   
