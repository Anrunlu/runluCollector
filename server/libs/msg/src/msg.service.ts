import {
  Injectable,
  HttpService,
  ServiceUnavailableException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { messageFormat } from './message.format';
import { QQMsg } from './message.dto';

@Injectable()
export class MsgService {
  constructor(private httpService: HttpService) {}

  sendToOne(user_id: number, qqMsg: QQMsg): any {
    return this.httpService
      .post(`${process.env.QQ_ROBOT}/send_private_msg`, {
        user_id,
        message: messageFormat(qqMsg),
      })
      .pipe(map(response => response.data))
      .toPromise()
      .catch(() => {
        throw new ServiceUnavailableException('发送失败');
      });
  }

  async sendToMany(users_id: Array<number>, qqMsg: QQMsg): Promise<any> {
    for (const user_id of users_id) {
      await this.httpService
        .post(`${process.env.QQ_ROBOT}/send_private_msg`, {
          user_id,
          message: messageFormat(qqMsg),
        })
        .toPromise()
        .catch(() => {
          throw new ServiceUnavailableException('发送失败');
        });
    }
    return { success: true };
  }
}
