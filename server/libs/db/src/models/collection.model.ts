import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Group } from './group.model';
import { Post } from './post.model';
import { Org } from './org.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
  },
})
export class Collection {
  @prop({ required: true })
  title: string;

  @prop({ ref: 'User' })
  creator: Ref<User>;

  @prop()
  description: string;

  @prop({ enum: ['public', 'private'] })
  property: string;

  @prop({ ref: 'Org' })
  org: Ref<Org>;

  @prop({ ref: 'Group' })
  groups: Ref<Group>[];

  @prop()
  fileformat: string[];

  @prop({ default: 1 })
  renamerule: number;

  @prop()
  endtime: Date;

  @prop()
  firetime: Date;

  @prop({
    localField: '_id',
    ref: 'Post',
    foreignField: 'desclt',
    justOne: false,
  })
  posts: Ref<Post>[];
}
