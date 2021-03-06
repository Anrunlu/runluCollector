import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Org } from './org.model';
import { Collection } from './collection.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
  },
})
export class Group {
  @prop()
  name: string;

  @prop()
  groupid: string;

  @prop({ ref: 'Org' })
  org: Ref<Org>;

  @prop({ ref: 'User' })
  creator: Ref<User>;

  @prop({ ref: 'User' })
  manager: Ref<User>[];

  @prop({ select: false })
  ddwebhook: string;

  @prop({ select: false })
  ddsecret: string;

  @prop({
    localField: '_id',
    ref: 'Collection',
    foreignField: 'groups',
    justOne: false,
  })
  collections: Ref<Collection>[];

  @prop({
    localField: '_id',
    ref: 'User',
    foreignField: 'groups',
    justOne: false,
  })
  members: Ref<User>[];
}
