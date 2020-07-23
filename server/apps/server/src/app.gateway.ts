import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InjectEventEmitter } from 'nest-emitter';
import { MyEventEmitter } from './app.events';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(@InjectEventEmitter() private readonly emitter: MyEventEmitter) {}

  private logger: Logger = new Logger('AppGateway');

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
  handleMessage(@MessageBody() msgData: { cltId: string }): WsResponse<any> {
    this.emitter.emit('mkzipStart', msgData.cltId);
    console.log(msgData.cltId);
    return {
      event: 'mkzipStart',
      data: { success: true, msg: 'mkzipStarted...' },
    };
  }
}
