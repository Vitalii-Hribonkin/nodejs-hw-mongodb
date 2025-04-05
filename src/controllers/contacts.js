import { createContact, deleteContact, getContact, getContactById, updateContact } from "../services/contact.js";
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
    const data = await getContact();

    res.json({
        status: 200,
        message: "Successfully find contacts",
        data,
    });
};

export const getContactsByIdController = async (req, res, next) => {
    const { contactId } = req.params;

    const data = await getContactById(contactId);

    // if (!data) {
    //     return res.status(404).json({
    //         status: 404,
    //         message: `Contact don't found by id=${contactId}`,
    //     });
    // }

    if (!data) {
         return next(createHttpError(404, 'Contact not found'));
    };

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
        ststus: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    } 
    res.status(204).send();
};


export const upsertContactController = async (req, res, next) => {
   const { contactId } = req.params;

  const result = await updateContact(contactId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};



export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);
    if (!result) {
        next(createHttpError(404, `Contact not found`));
        return;
    };
    res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: result.contact,
    });
};
