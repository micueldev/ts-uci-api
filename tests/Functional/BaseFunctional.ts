import * as authAction from '~/Functional/Actions/authAction';
import * as userAction from '~/Functional/Actions/userAction';
import * as bedAction from '~/Functional/Actions/bedAction';
import * as patientAction from '~/Functional/Actions/person/patientAction';
import * as expectResponse from '~/Functional/Expects/expectResponse';

import UserRepository from '@/DB/Model/User/UserRepository';
import BedRepository from '@/DB/Model/Bed/BedRepository';
import PersonRepository from '@/DB/Model/Person/PersonRepository';

export = {
  ...authAction,
  ...userAction,
  ...bedAction,
  ...patientAction,
  ...expectResponse,
  userRepository: new UserRepository(),
  bedRepository: new BedRepository(),
  personRepository: new PersonRepository(),
};
