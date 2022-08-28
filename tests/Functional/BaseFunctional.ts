import * as authAction from '~/Functional/Actions/authAction';
import * as userAction from '~/Functional/Actions/userAction';
import * as bedAction from '~/Functional/Actions/bedAction';
import * as expectResponse from '~/Functional/Expects/expectResponse';

import UserRepository from '@/DB/Model/User/UserRepository';
import BedRepository from '@/DB/Model/Bed/BedRepository';

export = {
  ...authAction,
  ...userAction,
  ...bedAction,
  ...expectResponse,
  userRepository: new UserRepository(),
  bedRepository: new BedRepository(),
};
