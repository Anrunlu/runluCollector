import { Injectable, HttpService } from '@nestjs/common';
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
      .pipe(map(response => response.data));
  }

  sendToMany(users_id: Array<number>, qqMsg: QQMsg): any {
    for (const user_id of users_id) {
      this.httpService
        .post(`${process.env.QQ_ROBOT}/send_private_msg`, {
          user_id,
          message: messageFormat(qqMsg),
        })
        .toPromise();
    }
    return { success: true };
  }
}
