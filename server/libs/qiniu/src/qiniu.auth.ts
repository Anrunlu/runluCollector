import * as qiniu from 'qiniu';
const accessKey = process.env.qiniuAccessKey;
const secretKey = process.env.qiniuSecretKey;
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

export const qiniuCDN = process.env.qiniuCDN;
export const srcBucket = process.env.srcBucket;

export function getMac(): any {
  return mac;
}
