import { Injectable, Logger } from '@nestjs/common';

import * as crypto from 'crypto'
import {v4 as uuidv4} from 'uuid'


const AES_ALGO = 'AES-256-CTR';
const IV_LENGTH = 16;
const ENCRYPTION_VERSION = process.env.ENCRYPTION_VERSION;


@Injectable()
export class UtilsService {
  constructor() {}

  getCoinbaseAuthorizedRequestHeaders(method, requestPath: string, body: string) {
    const timestamp = Date.now() / 1000;

    // create the prehash string by concatenating required parts
    const what = timestamp + method + requestPath + body;

    // decode the base64 secret
    const key = new Buffer(process.env.COINBASE_API_SECRET, 'base64');

    // create a sha256 hmac with the secret
    const hmac = crypto.createHmac('sha256', key);

    // sign the require message with the hmac
    // and finally base64 encode the result
    const sign = hmac.update(what).digest('base64');

    const headers = {
      'CB-ACCESS-KEY': process.env.COINBASE_API_KEY,
      'CB-ACCESS-PASSPHRASE': process.env.COINBASE_API_PASSPHRASE,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-SIGN': sign
    }
    
    return headers
  }


  /**
   * Encrypt some data.
   *
   * @param {*} value data to be encrypted
   * @param {string} encryptionKey AES-256 compatible key
   * @param {string} encryptionVersion
   * @returns {string}
   */
  encrypt(value: any, encryptionKey: string) {
    if (!encryptionKey) {
      throw new Error('Encryption key is not configured.');
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(AES_ALGO, encryptionKey, iv);
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${ENCRYPTION_VERSION}:${encrypted.toString('hex')}`;
  }

  /**
   * Decrypt some data.
   *
   * @param {*} value Data in the format iv:encryptedtext
   * @param {*} encryptionKey AES-256 compatible key
   * @returns {string}
   */
  decrypt(value: any, encryptionKey: string) {
    if (!encryptionKey) {
      throw new Error('Encryption key is not configured.');
    }

    const parts = value.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encVersion = parts.shift(); // eslint-disable-line
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(AES_ALGO, encryptionKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

}
