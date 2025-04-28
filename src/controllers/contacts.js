import createHttpError from 'http-errors';
import {
  deleteContact,
  getContact,
  getContactById,
  updateContact,
  createContact
} from "../services/contact.js";

import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { contactSortFields } from "../db/Models/Contacts.js";
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

// Отримання всіх контактів користувача
export const getContactsController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams({
    ...req.query,
    sortFields: contactSortFields,
  });

  const data = await getContact({
    ...paginationParams,
    ...sortParams,
    userId: req.user._id,
  });

  res.json({
    status: 200,
    message: "Successfully found contacts",
    data,
  });
};

// Отримання контакту за ID
export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;

  console.log(`Fetching contact with ID: ${contactId} for user: ${req.user._id}`);

  // Проверяем наличие контакта
  const data = await getContactById(req.user._id, contactId);

  if (!data) {
    console.log(`Contact with ID ${contactId} not found for user: ${req.user._id}`);
    throw createHttpError(404, 'Contact not found');
  }

  console.log(`Successfully found contact:`, data);

  res.json({
    status: 200,
    message: `Successfully found contact by id=${contactId}`,
    data,
  });
};

// Створення нового контакту
export const createContactController = async (req, res, next) => {
  try {
    const contact = await createContact(req.user._id, req.body);

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Видалення контакту
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  // Шукаємо контакт тільки для поточного користувача
  const contact = await deleteContact(req.user._id, contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

// Оновлення або створення контакту (upsert)
export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;

  const result = await updateContact(req.user._id, contactId, req.body, {
    upsert: true,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};

// Часткове оновлення контакту
export const patchContactController = async (req, res) => {
  const { contactId } = req.params;

  const result = await updateContact(req.user._id, contactId, req.body);

  if (!result) {
    throw createHttpError(404, `Contact not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};


export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(studentId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.student,
  });
};



