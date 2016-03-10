import P from 'bluebird';

import { NativeModules } from 'react-native';
const { FBLoginManager } = NativeModules;

function createParams(params = [], resolve, reject){
  return params.push((err, data) => { return (!err) ? resolve(data) : reject(err); });
}

function createPromise(fn){
  return new P((resolve, reject) => {
    fn.apply(this,createParams(Array.prototype.splice.call(arguments, 1), resolve, reject ));
  });
}

export async function getFBCredentials() {
  return await createPromise(FBLoginManager.getCredentials);
}

export async function loginWithPermissions(permissions = []) {
  return await createPromise(FBLoginManager.loginWithPermissions, permissions);
}

export async function loginWithoutPermissions() {
  return await createPromise(FBLoginManager.login);
}

export async function logout() {
  return await createPromise(FBLoginManager.logout);
}

export async function login(permissions = false) {
  return  (permissions) ? await loginWithPermissions(permissions) : await loginWithoutPermissions();
}


