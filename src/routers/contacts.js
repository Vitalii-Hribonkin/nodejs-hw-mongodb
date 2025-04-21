
import { Router } from "express";
import { createContactController, deleteContactController, getContactsByIdController, getContactsController, patchContactController, upsertContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrappers.js";
import { validateBody } from "../utils/validateBody.js";
import { contactAddSchema, contactUpdateSchema } from "../validation/contact.js";
import { isValidId } from "../midllewares/isValidId.js";
import { authenticate } from "../midllewares/authenticate.js";


const contactRouter = Router();
//#region-GET
contactRouter.use(authenticate);

contactRouter.get("/contacts", ctrlWrapper(getContactsController));

contactRouter.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactsByIdController));
//#endregion-GET

//#region-POST
contactRouter.post('/contacts', validateBody(contactAddSchema),ctrlWrapper(createContactController));
//#endregion-POST

//#region-DELETE
contactRouter.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));
//#endregion-DELETE

//#region-UPSERT
contactRouter.put('/contacts/:contactId', isValidId, validateBody(contactAddSchema),ctrlWrapper(upsertContactController));
//#endregion-UPSERT

//#region-PATCH
contactRouter.patch('/contacts/:contactId', isValidId, validateBody(contactUpdateSchema),ctrlWrapper(patchContactController));
//#endregion-PATCH
export default contactRouter;
