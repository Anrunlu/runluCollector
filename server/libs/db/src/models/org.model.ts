import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { Admin } from './admin.model';
import { User } from './user.model';
import { Group } from './group.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
  },
})
export class Org {
  @prop()
  name: string;

  @prop({ ref: 'User' })
  creator: Ref<Admin>;

  @prop({
    localField: '_id',
    ref: 'Group',
    foreignField: 'org',
    justOne: false,
  })
  groups: Ref<Group>[];

  @prop({
    localField: '_id',
    ref: 'User',
    foreignField: 'org',
    justOne: false,
  })
  members: Ref<User>[];
}
