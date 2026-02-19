import express from 'express';
import { authorizeJwt } from '@middlewares/auth.middleware';
import { addTestimonial, deleteTestimonialById, getTestimonialById, updateTestimonialById, getAllTestimonial } from '../controllers/testimonial.controller';
import { upload } from '@middlewares/multer.middleware';
const router = express.Router();


router.post('/', addTestimonial);
router.get('/', getAllTestimonial);
router.get('/getById/:id', getTestimonialById);
router.patch('/updateById/:id', updateTestimonialById);
router.delete('/deleteById/:id', deleteTestimonialById);

export default router;