import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  getManager,
  getRepository,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from '../users.entity';
import { UserFollowing } from '../users-follow.entity';

@EventSubscriber()
export class UserFollowSubscriber implements EntitySubscriberInterface<User> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return UserFollowing;
  }

  async afterInsert(event : InsertEvent<User>) {

    console.log(`Before Update : `, event.entity);



  }
}