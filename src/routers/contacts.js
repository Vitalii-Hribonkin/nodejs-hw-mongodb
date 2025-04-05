
import { Router } from "express";
import { createContactController, deleteContactController, getContactsByIdController, getContactsController, patchContactController, upsertContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrappers.js";


const contactRouter = Router();
//#region-GET
contactRouter.get("/contacts", ctrlWrapper(getContactsController));

contactRouter.get('/contacts/:contactId', ctrlWrapper(getContactsByIdController));
//#endregion-GET

//#region-POST
contactRouter.post('/contacts', ctrlWrapper(createContactController));
//#endregion-POST

//#region-DELETE
contactRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));
//#endregion-DELETE

//#region-UPSERT
contactRouter.put('/contacts/:contactId', ctrlWrapper(upsertContactController));
//#endregion-UPSERT

//#region-PATCH
contactRouter.patch('/contacts/:contactId', ctrlWrapper(patchContactController));
//#endregion-PATCH
export default contactRouter;
