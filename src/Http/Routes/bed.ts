import { Router } from 'express';
import { check } from 'express-validator'

import { getBeds, getBed, postBed, putBed, deleteBed } from '../Controllers/beds';
import validateJWT from '../Middlewares/validateJWT';
import validateFields from '../Middlewares/validateFields';


const commonValidations = [
    check('name', 'The name is required').notEmpty()
];

const router = Router();

router.get('/', [validateJWT], getBeds );
router.get('/:id', [validateJWT], getBed );
router.post('/', [
        validateJWT,
        ...commonValidations,
        validateFields
    ],
    postBed
);
router.put('/:id', [
    validateJWT,
    ...commonValidations,
    validateFields
], putBed );
router.delete('/:id', [validateJWT], deleteBed );


export default router;
