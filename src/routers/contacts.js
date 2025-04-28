// src/routers/contacts.js

import { Router } from "express";
import { 
  createContactController, 
  deleteContactController, 
  getContactsByIdController, 
  getContactsController, 
  patchContactController, 
  upsertContactController 
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrappers.js";
import { validateBody } from "../utils/validateBody.js";
import { contactAddSchema, contactUpdateSchema } from "../validation/contact.js";
import { isValidId } from "../midllewares/isValidId.js";
import { authenticate } from "../midllewares/authenticate.js";
import { upload } from "../midllewares/multer.js";

const contactRouter = Router();

//#region - Middleware
contactRouter.use(authenticate); // Защищаем роуты аутентификацией
//#endregion

//#region - GET
contactRouter.get(
  "/", 
  ctrlWrapper(getContactsController)  // Получение всех контактов
);

contactRouter.get(
  "/:contactId", 
  isValidId, 
  ctrlWrapper(getContactsByIdController)  // Получение контакта по ID
);
//#endregion

//#region - POST
contactRouter.post(
  "/", 
  upload.single('photo'), // Загрузка одного файла с полем 'photo'
  validateBody(contactAddSchema),  // Валидация данных для нового контакта
  ctrlWrapper(createContactController)  // Создание нового контакта
);
//#endregion

//#region - PUT (Upsert)
contactRouter.put(
  "/:contactId", 
  isValidId, 
  upload.single('photo'), // Загрузка одного файла с полем 'photo'
  validateBody(contactAddSchema),  // Валидация данных для обновления контакта
  ctrlWrapper(upsertContactController)  // Обновление или создание контакта
);
//#endregion

//#region - PATCH
contactRouter.patch(
  "/:contactId", 
  isValidId, 
  upload.single('photo'), // Загрузка одного файла с полем 'photo'
  validateBody(contactUpdateSchema),  // Валидация данных для частичного обновления контакта
  ctrlWrapper(patchContactController)  // Частичное обновление контакта
);
//#endregion

//#region - DELETE
contactRouter.delete(
  "/:contactId", 
  isValidId, 
  ctrlWrapper(deleteContactController)  // Удаление контакта по ID
);
//#endregion

export default contactRouter;
