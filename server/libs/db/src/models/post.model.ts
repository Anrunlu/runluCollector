import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Group } from './group.model';
import { Collection } from './collection.model';
import { Org } from './org.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Post {
  @prop()
  origname: string;

  @prop()
  filename: string;

  @prop()
  filetype: string;

  @prop()
  fileUrl: string;

  @prop({ ref: 'Collection' })
  desclt: Ref<Collection>;

  @prop({ ref: 'User' })
  creator: Ref<User>;

  @prop({ ref: 'Group' })
  groups: Ref<Group>;

  @prop({ ref: 'Org' })
  org: Ref<Org>;
}
