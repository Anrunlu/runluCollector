/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MsgService } from '@app/msg';
import { QQMsg, msgType } from '@app/msg/message.dto';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@libs/db/models/user.model';
import { Collection } from '@libs/db/models/collection.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { QueryService } from '../query/query.service';

@ApiTags('QQ消息相关')
@ApiBearerAuth()
@Controller('messages')
@UseGuards(AuthGuard('UserJwt'))
export class MessagesController {
  constructor(
    private msgService: MsgService,
    private queryService: QueryService,
    @InjectModel(User) private readonly userModel: ModelType<User>,
    @InjectModel(Collection) private readonly cltModel: ModelType<Collection>,
  ) {}

  // @Post('receive')
  // handleReceiveMsg(@Body() msg: any): void {
  //   console.log(msg);
  // }

  @Get('sendNotifyToOne')
  @ApiOperation({ summary: '向单个用户发送QQ通知' })
  async handlesendNotifyToOne(
    @Query('cltId') cltId: string,
    @Query('userId') userId: string,
  ): Promise<any> {
    // 判断收集是否已截止
    await this.queryService.isCollectionEnd(cltId);

    const clt = await this.cltModel
      .findById(Types.ObjectId(cltId))
      .populate('creator');
    const user = await this.userModel
      .findById(Types.ObjectId(userId))
      .select('qq');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let content = '';
    if (clt.property === 'private') {
      content = `请尽快处理您的提交任务\n收集标题：${clt.title}\n收集者：${
        (clt.creator as User).nickname
      }\n提交地址：${process.env.SERVER_DOMAIN}/collections/${clt._id}`;
    } else {
      content = `提醒你查看一个公开征集\n征集标题：${clt.title}\n征集者：${
        (clt.creator as User).nickname
      }\n征集地址：${process.env.SERVER_DOMAIN}/collections/${clt._id}`;
    }
    const msg: QQMsg = {
      type: msgType.CREATOR_NOTICE,
      content,
    };
    return this.msgService.sendToOne(Number(user.qq), msg);
  }

  @Get('sendNotifyToGroup')
  @ApiOperation({ summary: '向群组用户发送QQ通知' })
  async handleSendToGroup(
    @Query('cltId') cltId: string,
    @Query('groupId') groupId: string,
  ): Promise<any> {
    // 判断收集是否已截止
    await this.queryService.isCollectionEnd(cltId);

    const clt = await this.cltModel
      .findById(Types.ObjectId(cltId))
      .populate('creator');
    const users = await this.userModel
      .find({
        groups: Types.ObjectId(groupId),
      })
      .select('qq');
    const users_qq = users.reduce((pre, curr) => {
      pre.push(Number(curr.qq));
      return pre;
    }, []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let content = '';
    if (clt.property === 'private') {
      content = `请尽快处理您的提交任务\n收集标题：${clt.title}\n收集者：${
        (clt.creator as User).nickname
      }\n提交地址：${process.env.SERVER_DOMAIN}/collections/${clt._id}`;
    } else {
      content = `提醒你查看一个公开征集\n征集标题：${clt.title}\n征集者：${
        (clt.creator as User).nickname
      }\n征集地址：${process.env.SERVER_DOMAIN}/collections/${clt._id}`;
    }
    const msg: QQMsg = {
      type: msgType.CREATOR_NOTICE,
      content,
    };
    return this.msgService.sendToMany(users_qq, msg);
  }
}
