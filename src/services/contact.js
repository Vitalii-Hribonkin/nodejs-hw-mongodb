import ContactsCollection from "../db/Models/Contacts.js";

export const getContact = () => ContactsCollection.find();

export const getContactById = id => ContactsCollection.findOne({ _id: id });