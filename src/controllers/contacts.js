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

  const contact = await deleteContact(req.user._id, contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Contact successfully deleted',
    data: contact,
  });
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
