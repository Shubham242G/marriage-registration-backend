import express from 'express';
import { authorizeJwt } from '@middlewares/auth.middleware';
import { addContact, deleteContactById, getContactById, updateContactById, getAllContact } from '../controllers/contact.controller';
import { upload } from '@middlewares/multer.middleware';
const router = express.Router();


router.post('/', addContact);
router.get('/', getAllContact);
router.get('/getById/:id', getContactById);
router.patch('/updateById/:id', updateContactById);
router.delete('/deleteById/:id', deleteContactById);

export default router;