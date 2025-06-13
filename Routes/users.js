import { Router } from 'express';
import { register, login, logout } from '../Service/userController.js';


// Skapa en ny router-instans
const userRouter = Router();

// POST /api/auth/register
// Används för att registrera en ny användare
userRouter.post('/register', register);

// POST /api/auth/login
// Används för att logga in en befintlig användare
userRouter.post('/login', login);

// GET /api/auth/logout
// Används för att logga ut
userRouter.get('/logout', logout);

export default userRouter;
