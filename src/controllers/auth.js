import dotenv from 'dotenv';
dotenv.config();
import { loginUser, logoutUser, refreshUsersSession, registerUser } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import createHttpError from 'http-errors';

// Реєстрація користувача
export const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// Логін користувача
export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } = await loginUser({ email, password });

    // Встановлюємо refreshToken у куки
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Якщо в продакшн, використовуємо secure
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Оновлення сесії
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    expires: new Date(Date.now() + ONE_DAY), // Тривалість життя куків - 1 день
  });
  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + ONE_DAY), // Тривалість життя куків - 1 день
  });
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { refreshToken, sessionId } = req.cookies;

    // Перевіряємо, чи є refreshToken і sessionId в куках
    if (!refreshToken || !sessionId) {
      throw createHttpError(400, 'Missing required cookies');
    }

    const session = await refreshUsersSession({ sessionId, refreshToken });

    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Логаут
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');  // Очищаємо cookie
  res.clearCookie('refreshToken'); // Очищаємо cookie

  res.status(204).send();
};
