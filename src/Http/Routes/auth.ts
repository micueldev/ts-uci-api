import { Router } from 'express';
import { check } from 'express-validator';

import { login } from '@/Http/Controllers/auth';
import validateFields from '@/Http/Middlewares/validateFields';

const router = Router();

router.post(
  '/login',
  [
    check('username', 'The username must have at least 4 characters').isLength({
      min: 4,
    }),
    check('password', 'The password must have at least 6 characters').isLength({
      min: 6,
    }),
    validateFields,
  ],
  login,
);

export default router;
