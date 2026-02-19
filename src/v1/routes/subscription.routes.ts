import express from 'express';
import { authorizeJwt } from '@middlewares/auth.middleware';
import { addSubscription, deleteSubscriptionById, getSubscriptionById, updateSubscriptionById, getAllSubscription } from '../controllers/subscription.controller';
import { upload } from '@middlewares/multer.middleware';
const router = express.Router();


router.post('/', addSubscription);
router.get('/', getAllSubscription);
router.get('/getById/:id', getSubscriptionById);
router.patch('/updateById/:id', updateSubscriptionById);
router.delete('/deleteById/:id', deleteSubscriptionById);

export default router;