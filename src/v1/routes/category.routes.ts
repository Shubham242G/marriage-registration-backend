import express from 'express';
import { authorizeJwt } from '@middlewares/auth.middleware';
import { addCategory, deleteCategoryById, getCategoryById, updateCategoryById, getAllCategory } from '../controllers/category.controller';
import { upload } from '@middlewares/multer.middleware';
const router = express.Router();


router.post('/', addCategory);
router.get('/', getAllCategory);
router.get('/getById/:id', getCategoryById);
router.patch('/updateById/:id', updateCategoryById);
router.delete('/deleteById/:id', deleteCategoryById);

export default router;