import { Router } from 'express';
import { check } from 'express-validator';

import {
  getPatients,
  getPatient,
  postPatient,
  putPatient,
  deletePatient,
} from '@/Http/Controllers/person/patients';
import Validator from '@/Http/Model/Validator';
import validateJWT from '@/Http/Middlewares/validateJWT';
import validateFields from '@/Http/Middlewares/validateFields';

const commonValidations = [
  check(
    'first_name',
    'The first_name must have at least 3 characters',
  ).isLength({ min: 3 }),
  check('last_name', 'The last_name must have at least 3 characters').isLength({
    min: 3,
  }),
  check('birth_date', 'The birth_date is invalid').isDate(),
  check('document_number', 'The document_number is required').notEmpty(),
  check('document_number').custom((value) =>
    Validator.isStringNumeric(value, { field: 'document_number' }),
  ),
  check('account_number', 'The account_number is required').notEmpty(),
  check('account_number').custom((value) =>
    Validator.isStringNumeric(value, { field: 'account_number' }),
  ),
  check('weight', 'The weight is invalid').isNumeric(),
  check('start_institute', 'The start_intitute is invalid').isDate(),
  check('start_uci', 'The start_uci is invalid').isDate(),
];

const router = Router();

router.get('/', [validateJWT], getPatients);
router.get('/:id', [validateJWT], getPatient);
router.post(
  '/',
  [validateJWT, ...commonValidations, validateFields],
  postPatient,
);
router.put(
  '/:id',
  [validateJWT, ...commonValidations, validateFields],
  putPatient,
);
router.delete('/:id', [validateJWT], deletePatient);

export default router;
