import { createContact, deleteContact, getContact, getContactById, updateContact } from "../services/contact.js";
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { contactSortFields } from "../db/Models/Contacts.js";


export const getContactsController = async (req, res) => {
    
    const paginationParams = parsePaginationParams(req.query);
    const sortParams = parseSortParams({
  ...req.query,
  sortFields: contactSortFields,
});

    const data = await getContact({...paginationParams, ...sortParams});
    
    res.json({
        status: 200,
        message: "Successfully find contacts",
        data,
    });
};

export const getContactsByIdController = async (req, res) => {
    const { contactId } = req.params;

    const data = await getContactById(contactId);

    if (!data) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: `Successfully find contact by id=${contactId}`,
        data,
    });
};

export const createContactController = async (req, res) => {
    const { name, phoneNumber, isFavourite } = req.body;
    const contact = await createContact({
        name,
        phoneNumber,
        isFavourite,
    });
    
    

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
};

export const upsertContactController = async (req, res) => {
    const { contactId } = req.params;

    const result = await updateContact(contactId, req.body, {
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

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result) {
        throw createHttpError(404, `Contact not found`);
    }

    res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: result.contact,
    });
};
