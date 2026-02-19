import express from 'express';
import { authorizeJwt } from '@middlewares/auth.middleware';
import { addBlog, deleteBlogById, getBlogById, updateBlogById, getAllBlog, getBlogBySlug } from '../controllers/blog.controller';
import { upload } from '@middlewares/multer.middleware';
const router = express.Router();


router.post('/', addBlog);
router.get('/', getAllBlog);
router.get('/getById/:id', getBlogById);
router.get('/getBySlug/:slug', getBlogBySlug);
router.patch('/updateById/:id', updateBlogById);
router.delete('/deleteById/:id', deleteBlogById);

export default router;