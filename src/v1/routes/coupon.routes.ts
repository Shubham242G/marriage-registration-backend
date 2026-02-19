import express from 'express';
import { authorizeJwt } from '@middlewares/auth.middleware';
import { addCoupon, deleteCouponById, getCouponById, updateCouponById, getAllCoupon, applyCoupon } from '../controllers/coupon.controller';
import { upload } from '@middlewares/multer.middleware';
const router = express.Router();


router.post('/', addCoupon);
router.get('/', getAllCoupon);
router.get('/getById/:id', getCouponById);
router.patch('/updateById/:id', updateCouponById);
router.delete('/deleteById/:id', deleteCouponById);
router.post('/applyCoupon', authorizeJwt, applyCoupon);

export default router;