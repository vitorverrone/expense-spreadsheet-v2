import { Router } from 'express';
import { getUser, createUser, login } from '../controllers/userController.js';

const router = Router();

// CREATE USER
router.route('/login').post(login);

// CREATE USER
router.route('/').post(createUser);

// GET USER
router.route('/:id').get(getUser);

export default router;
