import express from 'express';
import { authorizeJwt } from '@middlewares/auth.middleware';
import { addDocument, deleteDocumentById, getDocumentById, updateDocumentById, getAllDocument, getDocumentByUser, getDocumentByUserId } from '../controllers/document.controller';
import { upload } from '@middlewares/multer.middleware';
const router = express.Router();


router.post('/', authorizeJwt, addDocument);
router.get('/', getAllDocument);
router.get('/getByUser', authorizeJwt, getDocumentByUser);
router.get('/getById/:id', getDocumentById);
router.get('/getByUserId/:userId', getDocumentByUserId);
router.patch('/updateById/:id', updateDocumentById);
router.delete('/deleteById/:id', deleteDocumentById);

export default router;