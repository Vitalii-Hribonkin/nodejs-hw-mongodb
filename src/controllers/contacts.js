import { deleteContact, getContact, getContactById, updateContact } from "../services/contact.js";
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import ContactsCollection, { contactSortFields } from "../db/Models/Contacts.js";

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
        userId: req.user._id, // Вибірка тільки для поточного користувача
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

    // Шукаємо контакт тільки для поточного користувача
    const data = await getContactById(contactId, req.user._id);

    if (!data) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: `Successfully found contact by id=${contactId}`,
        data,
    });
};

// Створення нового контакту
export const createContactController = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const contact = await ContactsCollection.create({
      name,
      email,
      phone,
      userId: req.user._id, // Прив'язка контакту до користувача
    });

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

// Видалення контакту
export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;

    // Шукаємо контакт тільки для поточного користувача
    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
};

// Оновлення чи створення контакту
export const upsertContactController = async (req, res) => {
    const { contactId } = req.params;

    // Шукаємо контакт тільки для поточного користувача
    const result = await updateContact(contactId, req.body, {
        upsert: true,
        userId: req.user._id, // Перевірка належності контакту
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

    // Шукаємо контакт тільки для поточного користувача
    const result = await updateContact(contactId, req.body, {
        userId: req.user._id, // Перевірка належності контакту
    });

    if (!result) {
        throw createHttpError(404, `Contact not found`);
    }

    res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: result.contact,
    });
};
