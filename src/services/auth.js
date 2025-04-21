import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { UsersCollection } from '../db/Models/User.js';
import { SessionsCollection } from '../db/Models/Session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';

// Регистрация пользователя
export const registerUser = async (payload) => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

// Логин пользователя
export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      email: user.email,
    },
    session,
  };
};

// Обновление сессии
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing session ID or refresh token');
  }

  const session = await SessionsCollection.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isExpired = new Date(session.refreshTokenValidUntil) < new Date();
  if (isExpired) {
    await SessionsCollection.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionsCollection.deleteOne({ _id: session._id });

  const newSession = createSession();

  const createdSession = await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });

  return createdSession;
};

// Логаут
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
