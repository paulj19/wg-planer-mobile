import {decode, encode} from 'base-64';

export default function initBase64(): void {
  if (!global.btoa) {
    global.btoa = encode;
  }
  
  if (!global.atob) {
    global.atob = decode;
  }
}

