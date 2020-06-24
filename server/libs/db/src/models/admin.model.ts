import { prop, modelOptions } from '@typegoose/typegoose';
import { hashSync } from 'bcrypt';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
  },
})
export class Admin {
  @prop()
  username: string;

  @prop({
    select: false,
    get(val) {
      return val;
    },
    set(val) {
      return val ? hashSync(val, 10) : val;
    },
  })
  password: string;

  @prop()
  nickname: string;

  @prop()
  email: string;

  @prop()
  qq: string;

  @prop({ default: 1 })
  userlevel: number;
}
