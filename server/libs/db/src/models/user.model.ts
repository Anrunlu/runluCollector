import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { hashSync } from 'bcrypt';
import { Group } from './group.model';
import { Post } from './post.model';
import { Collection } from './collection.model';
import { Org } from './org.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
  },
})
export class User {
  @prop({ ref: 'Org' })
  org: Ref<Org>;

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
  avatar: string;

  @prop()
  email: string;

  @prop()
  qq: string;

  @prop({ ref: 'Group' })
  groups: Ref<Group>[];

  @prop({ default: 1 })
  userlevel: number;

  @prop({
    localField: '_id',
    ref: 'Post',
    foreignField: 'creator',
    justOne: false,
  })
  uposts: Ref<Post>[];

  @prop({
    localField: '_id',
    ref: 'Collection',
    foreignField: 'creator',
    justOne: false,
  })
  uclts: Ref<Collection>[];

  @prop({
    localField: '_id',
    ref: 'Group',
    foreignField: 'creator',
    justOne: false,
  })
  ugroups: Ref<Group>[];

  @prop({
    localField: '_id',
    ref: 'Group',
    foreignField: 'manager',
    justOne: false,
  })
  mgroups: Ref<Group>[];
}
