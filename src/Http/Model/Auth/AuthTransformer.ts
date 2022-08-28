import User from '@/Domain/Model/User/User';

export interface LoginProps {
  username: string;
  password: string;
}

interface DefaultLoginOutputProps {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  token: string;
}

class AuthTransformer {
  public static DefaultLoginOutput(
    user: User,
    token: string,
  ): DefaultLoginOutputProps {
    return {
      id: user.id!,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      token,
    };
  }
}

export default AuthTransformer;
