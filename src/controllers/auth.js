import createHttpError from 'http-errors';
import { loginUser, logoutUser, refreshUsersSession, registerUser } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';

// Регистрация пользователя
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

// Логин пользователя
export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user, session } = await loginUser({ email, password });

    // Устанавливаем куки
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + ONE_DAY),
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

// Обновление сессии
export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { refreshToken, sessionId } = req.cookies;

    if (!refreshToken || !sessionId) {
      throw createHttpError(400, 'Missing required cookies');
    }

    const session = await refreshUsersSession({ sessionId, refreshToken });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + ONE_DAY),
    });

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

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
