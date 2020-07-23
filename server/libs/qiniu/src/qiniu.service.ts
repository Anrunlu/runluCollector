import { Injectable, OnModuleInit } from '@nestjs/common';
import * as qiniu from 'qiniu';
import { getMac, srcBucket, qiniuCDN } from './qiniu.auth';
import { InjectModel } from 'nestjs-typegoose';
import { Collection } from '@libs/db/models/collection.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Post } from '@libs/db/models/post.model';
import { InjectEventEmitter } from 'nest-emitter';
import { MyEventEmitter } from 'apps/server/src/app.events';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class QiniuService implements OnModuleInit {
  constructor(
    @InjectModel(Collection) private readonly cltModel: ModelType<Collection>,
    @InjectEventEmitter() private readonly emitter: MyEventEmitter,
  ) {}

  onModuleInit(): void {
    this.emitter.on('mkzipStart', async msg => await this.onMkzipStart(msg));
  }

  /* 创建七牛 BucketManager对象 用于管理文件 */
  createBucketManager(): any {
    const config = new qiniu.conf.Config();
    //config.useHttpsDomain = true;
    (config as any).zone = qiniu.zone.Zone_z0;
    const bucketManager = new qiniu.rs.BucketManager(getMac(), config);
    return bucketManager;
  }

  /* 生成上传token */
  generateUploadToken(): any {
    const options = {
      scope: srcBucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(getMac());
    return { uploadToken };
  }

  /* 删除单个文件 */
  async deleteSingleFile(filekey: string): Promise<any> {
    const bucketManager = this.createBucketManager();
    return await new Promise((resolve, reject) => {
      bucketManager.delete(srcBucket, filekey, (err, respBody, respInfo) => {
        if (err) {
          console.log(err);
          reject(err);
          //throw err;
        }
        if (respInfo.statusCode === 200) {
          resolve({ success: true });
        } else {
          reject({
            code: respInfo.statusCode,
            body: respBody,
          });
        }
      });
    });
  }

  /* zip打包 */
  async mkzip(cltId: string): Promise<any> {
    // 定义zip文件名
    const zipFileName = `${cltId}-${Date.now()}.zip`;
    const savedZipEntry = qiniu.util.urlsafeBase64Encode(
      `${srcBucket}:${zipFileName}`,
    );
    // 获取mac令牌
    const mac = getMac();
    // 七牛持久化数据存储服务指令和配置
    const persistentOps = `mkzip/4/|saveas/${savedZipEntry}`;
    const options = {
      scope: srcBucket,
      persistentOps,
      // 数据处理队列名称，必填
      persistentPipeline: process.env.persistentPipeline,
      // 数据处理完成结果通知地址
      persistentNotifyUrl: process.env.persistentNotifyUrl,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);

    // 拼装数据写入索引文件
    // files不能超过三千个
    const { posts } = await this.cltModel.findById(cltId).setOptions({
      populate: {
        path: 'posts',
        select: '+fileUrl',
        populate: { path: 'creator' },
      },
    });
    console.log('已获取打包文件列表');

    let urlAndAlias = '';
    posts.forEach(post => {
      urlAndAlias += `/url/${qiniu.util.urlsafeBase64Encode(
        qiniuCDN + '/' + escape((post as Post).fileUrl.split('/').pop()),
      )}`;
      urlAndAlias += `/alias/${qiniu.util.urlsafeBase64Encode(
        `${(post as any).creator.username}-${(post as any).creator.nickname}.${
          (post as Post).filetype
        }`,
      )}`;
      urlAndAlias += '\n';
    });

    // 创建mkzip目录
    if (!fs.existsSync(path.join('mkzip'))) {
      fs.mkdirSync(path.join('mkzip'));
      console.log('创建mkzip目录成功');
    }
    // 在mkzip目录生成索引文件
    const indexFilePath = path.join('mkzip', `${Date.now()}-${cltId}.txt`);
    console.log(indexFilePath);
    fs.writeFileSync(indexFilePath, urlAndAlias, { encoding: 'utf-8' });

    // 上传索引文件，并在云端执行打包操作
    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const key = indexFilePath;

    // 定义一个promise等待返回
    const put_file = new Promise((resolve, reject) => {
      formUploader.putFile(
        uploadToken,
        key,
        indexFilePath,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
          }
          if (respInfo.statusCode === 200) {
            resolve(respBody);
          } else {
            reject({
              code: respInfo.statusCode,
              body: respBody,
            });
          }
        },
      );
    });
    return await put_file;
  }

  /* 监听打包开始事件 */
  async onMkzipStart(cltId: string): Promise<void> {
    console.log('收到信号，开始打包');
    const res = await this.mkzip(cltId);
    console.log(res);
  }
}
