import { sortList } from "../constants/index.js";
import ContactsCollection from "../db/Models/Contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getContact = async({ page = 1, perPage = 10, sortBy = '_id', sortOrder = sortList[0] }) => {
    const skip = (page - 1) * perPage;

    const data = await ContactsCollection.find()
        .skip(skip)
        .limit(perPage).sort({[sortBy]: sortOrder});

    const totalItems = await ContactsCollection.countDocuments();
    const paginationData = calculatePaginationData({ page, perPage, totalItems });



    return {
        data,
        page,
        perPage,
        totalItems,
        ...paginationData,
    };
};



export const getContactById = id => ContactsCollection.findOne({ _id: id });

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const deleteContact = async (contactId) => {
    const contact = await ContactsCollection.findOneAndDelete({
        _id: contactId,
    });
    return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate(
        { _id: contactId },
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