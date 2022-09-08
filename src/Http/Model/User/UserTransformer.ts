import DateFormatter from '@/Http/Model/DateFormatter';
import User from '@/Domain/Model/User/User';

export interface PostUserProps {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface PutUserProps {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface DefaultUserOutputProps {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

class UserTransformer {
  public static postBodyToUser(body: PostUserProps): User {
    const user = new User();
    user.username = body.username;
    user.firstName = body.first_name;
    user.lastName = body.last_name;
    user.email = body.email;
    user.setPassword(body.password);

    return user;
  }

  public static putBodyToUser(body: PutUserProps): User {
    const user = new User();
    user.username = body.username;
    user.firstName = body.first_name;
    user.lastName = body.last_name;
    user.email = body.email;

    return user;
  }

  public static userToDefaultOutput(user: User): DefaultUserOutputProps {
    return {
      id: user.id!,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      created_at: DateFormatter.format(user.createdAt),
      updated_at: DateFormatter.format(user.updatedAt),
    };
  }
}

export default UserTransformer;
