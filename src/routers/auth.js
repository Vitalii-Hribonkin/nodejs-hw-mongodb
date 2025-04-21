import { Router } from 'express';
import { validateBody } from "../utils/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrappers.js";
import { loginUserController, logoutUserController, refreshUserSessionController, registerUserController } from "../controllers/auth.js";

const authRouter = Router();

// Реєстрація
authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

// Логін
authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

// Оновлення сесії
authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));

// Вихід
authRouter.post('/logout', ctrlWrapper(logoutUserController));

export default authRouter;
