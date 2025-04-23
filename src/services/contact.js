import { sortList } from "../constants/index.js";
import ContactsCollection from "../db/Models/Contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";


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


export const getContactById = async (userId, contactId) => {
  return ContactsCollection.findOne({ _id: contactId, userId });
};


export const createContact = async (userId, payload) => {
  const contact = await ContactsCollection.create({ ...payload, userId });
  return contact;
};


export const deleteContact = async (userId, contactId) => {
  return ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};



export const updateContact = async (userId, contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    }
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
