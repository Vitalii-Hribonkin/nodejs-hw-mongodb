import { Schema, model } from 'mongoose';
import { typeList } from '../../constants/contacts.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      required: true,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true, // Контакт повинен мати власника
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const contactSortFields = [
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];

const ContactsCollection = model('contacts', contactSchema);

export default ContactsCollection;
