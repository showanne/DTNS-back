import express from 'express'
// import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import {
  newArticle,
  getArticle,
  editArticle
} from '../controllers/article.js'

const router = express.Router()

// '/' = '/article'
// router.請求方式(路徑, 處理function)

// newArticle 新增文章
router.post('/', upload, newArticle)
// newArticle 新增文章 先驗證再做上傳
// router.post('/newArticleMember', auth, upload, newArticleMember)
// getArticle 取得所有文章
router.get('/', getArticle)
// editArticle 編輯文章
router.patch('/:id', upload, editArticle)
// router.post('/:id', auth , upload, editArticle)

export default router
