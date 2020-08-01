import { QQMsg } from './message.dto';

export function messageFormat(msg: QQMsg): string {
  switch (msg.type) {
    case 'sys_notice':
      return `${process.env.sys_notice}\n${msg.content}`;
    case 'new_private_task_notice':
      return `${process.env.new_private_task_notice}\n${msg.content}`;
    case 'new_public_task_notice':
      return `${process.env.new_public_task_notice}\n${msg.content}`;
    case 'before_task_done_notice':
      return `${process.env.before_task_done_notice}\n${msg.content}`;
    case 'creator_notice':
      return `${process.env.creator_notice}\n${msg.content}`;
    case 'post_uploaded_notice':
      return `${process.env.post_uploaded_notice}\n${msg.content}`;
  }
}
