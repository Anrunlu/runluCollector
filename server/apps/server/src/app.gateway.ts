import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WsResponse,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InjectEventEmitter } from 'nest-emitter';
import { MyEventEmitter } from './app.events';

@WebSocketGateway()
export class AppGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit {
  constructor(@InjectEventEmitter() private readonly emitter: MyEventEmitter) {}

  onModuleInit(): void {
    this.emitter.on('mkzipEnd', async msg => await this.onMkzipEnd(msg));
  }

  private logger: Logger = new Logger('AppGateway');
  private currClient: Socket[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server): void {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /* 监听开始打包消息 */
  @SubscribeMessage('mkzip')
  handleMessage(
    @MessageBody() msgData: { cltId: string; renameRule: number },
    @ConnectedSocket() client: Socket,
  ): WsResponse<any> {
    this.currClient.push(client);
    this.emitter.emit('mkzipStart', {
      cltId: msgData.cltId,
      renameRule: msgData.renameRule,
    });
    console.log(msgData.cltId);
    return {
      event: 'mkzipStart',
      data: { success: true, msg: 'mkzipStarted...' },
    };
  }

  /* 发送打包结果通知 */
  onMkzipEnd(msg: string): void {
    console.log(msg);
    if (msg !== 'failed') {
      this.currClient.shift().emit('mkzipEnd', { success: true, key: msg });
    } else {
      this.currClient.shift().emit('mkzipEnd', { success: false });
    }
  }
}
