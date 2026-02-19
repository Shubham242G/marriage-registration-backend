import express from 'express';
import { authorizeJwt } from '@middlewares/auth.middleware';
import { addSubscriber, deleteSubscriberById, getSubscriberById, updateSubscriberById, getAllSubscriber } from '../controllers/subscriber.controller';
import { upload } from '@middlewares/multer.middleware';
const router = express.Router();


router.post('/', addSubscriber);
router.get('/', getAllSubscriber);
router.get('/getById/:id', getSubscriberById);
router.patch('/updateById/:id', updateSubscriberById);
router.delete('/deleteById/:id', deleteSubscriberById);

export default router;