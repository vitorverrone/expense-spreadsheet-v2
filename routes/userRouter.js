import { Router } from 'express';
import { getUser, createUser, login, updateUser } from '../controllers/userController.js';

const router = Router();

// CREATE USER
router.route('/login').post(login);

// CREATE USER
router.route('/').post(createUser);

// GET USER
router.route('/:id').get(getUser);

// UPDATE USER
router.route('/:id').patch(updateUser);

export default router;
