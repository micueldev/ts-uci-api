import { Router } from 'express';
import { check } from 'express-validator';

import { getUsers, getUser, postUser, putUser } from '@/Http/Controllers/users';
import validateJWT from '@/Http/Middlewares/validateJWT';
import validateFields from '@/Http/Middlewares/validateFields';

const commonValidations = [
  check('username', 'The username must have at least 4 characters').isLength({
    min: 4,
  }),
  check(
    'first_name',
    'The first_name must have at least 3 characters',
  ).isLength({ min: 3 }),
  check('last_name', 'The last_name must have at least 3 characters').isLength({
    min: 3,
  }),
  check('email', 'The email is invalid').isEmail(),
];

const router = Router();

router.get('/', [validateJWT], getUsers);
router.get('/:id', [validateJWT], getUser);
router.post(
  '/',
  [
    validateJWT,
    ...commonValidations,
    check('password', 'The password must have at least 6 characters').isLength({
      min: 6,
    }),
    validateFields,
  ],
  postUser,
);
router.put(
  '/:id',
  [validateJWT, ...commonValidations, validateFields],
  putUser,
);

export default router;
