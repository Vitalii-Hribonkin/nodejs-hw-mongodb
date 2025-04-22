
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

contactRouter.get("/", ctrlWrapper(getContactsController));

contactRouter.get('/:contactId', isValidId, ctrlWrapper(getContactsByIdController));
//#endregion-GET

//#region-POST
contactRouter.post('/', validateBody(contactAddSchema),ctrlWrapper(createContactController));
//#endregion-POST

//#region-DELETE
contactRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
//#endregion-DELETE

//#region-UPSERT
contactRouter.put('/:contactId', isValidId, validateBody(contactAddSchema),ctrlWrapper(upsertContactController));
//#endregion-UPSERT

//#region-PATCH
contactRouter.patch('/:contactId', isValidId, validateBody(contactUpdateSchema),ctrlWrapper(patchContactController));
//#endregion-PATCH
export default contactRouter;
