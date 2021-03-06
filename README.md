# runluCollector

#### 介绍

润鲁收集系统 V2.0 后台，基于 Nestjs 开发。

本产品是一个主要面向学生的文件收集系统，旨在帮助大家提高收集整理文件的效率。本产品通过内建组件与第三方存储（七牛云存储）API 的整合，实现文件**云端存储、打包、自动重命名等**，让**收集者**告别繁琐的文件整理工作；通过与**钉钉群消息机器人**Webhook 的整合，自动发送钉钉消息提醒，使收集者无需做多余的提醒工作，同时也能避免**提交者**忘记提交的烦恼，提高效率。

#### 软件架构

![服务端技术点](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/learn/self_notes/20210505104010.png)

![设计理念](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/learn/self_notes/20210505104057.png)

![开发框架](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/learn/self_notes/1.png)

![数据库](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/learn/self_notes/20210505104118.png)

![存储](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/learn/self_notes/20210505104128.png)

![部署](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/learn/self_notes/20210505104138.png)

![消息系统](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/learn/self_notes/2.png)

#### 安装教程

##### 软件环境

Nodejs：v14.60 +

Python：v3.7 +

Pipenv：v2018.11.26 +

MongoDB：v4.0 +

Nginx：v1.14.0

PM2：v4.4.0 +

##### 服务端部署

1. 确保 MongoDB 服务已启动
2. 进入项目 server 目录，运行**npm install** 安装依赖
3. 在 server 目录运行**nest build server** 命令构建面向客户端的服务
4. 在 server 目录运行**nest build admin**命令构建面向管理端的服务
5. 进入 server/dist/apps/server 文件夹，运行 **pm2 main**，运行客户端服务
6. 进入 server/dist/apps/admin 文件夹，运行 **pm2 main**，运行服务端服务
7. 服务端部署完毕

##### 消息系统部署

1. 进入项目 msgserver 目录，运行**pipenv install** 安装依赖

2. 继续在 msgserver 目录运行**pipenv shell** 激活当前虚拟环境

3. 继续在 msgserver 目录运行**gunicorn --worker-class eventlet -w 1 -D -b 127.0.0.1:5001** app:app ，运行消息系统服务

4. 消息系统部署完毕

#### 使用说明

[润鲁收集系统客户端使用说明](https://www.yuque.com/docs/share/6a573a3c-5071-46f9-a300-4878841b23aa?#)

[润鲁收集系统管理端使用说明](https://www.yuque.com/docs/share/b0bba4ec-7f29-48a2-b55b-d2f6578b027b?#)

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

#### License

Copyright (c) 2020-present Runlu An

[MIT licensed](https://en.wikipedia.org/wiki/MIT_License).
