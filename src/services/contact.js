import { sortList } from "../constants/index.js";
import ContactsCollection from "../db/Models/Contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

// Отримання контактів для конкретного користувача з пагінацією
export const getContact = async ({ userId, page = 1, perPage = 10, sortBy = '_id', sortOrder = sortList[0] }) => {
  const skip = (page - 1) * perPage;

  const filter = { userId };

  const data = await ContactsCollection.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const totalItems = await ContactsCollection.countDocuments(filter); 

  const paginationData = calculatePaginationData({ page, perPage, totalItems });

  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

// Отримання контакту за ID для конкретного користувача
export const getContactById = async (userId, id) => {
  return ContactsCollection.findOne({ _id: id, userId }); // фільтрація по userId
};

// Створення нового контакту
export const createContact = async (userId, payload) => {
  const contact = await ContactsCollection.create({ ...payload, userId }); // додаємо userId
  return contact;
};

// Видалення контакту для конкретного користувача
export const deleteContact = async (userId, contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId, userId }); // фільтрація по userId
  return contact;
};

// Оновлення контакту для конкретного користувача
export const updateContact = async (userId, contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId }, // фільтрація по userId
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
