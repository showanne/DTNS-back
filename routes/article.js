import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import {
  newArticle,
  getArticle,
  getAllArticle,
  getArticleById,
  editArticle
} from '../controllers/article.js'

const router = express.Router()

// '/' = '/article'
// router.請求方式(路徑, 處理function)

// newArticle 新增文章
router.post('/', upload, newArticle)
// newArticle 新增文章 先驗證再做上傳
// router.post('/newArticleMember', auth, upload, newArticleMember)
// getArticle 取得文章 條件設定為有開放(share)的 (一般會員看)
router.get('/', getArticle)
// getAllArticle 取得所有文章 (後台管理看)
router.get('/all', auth, getAllArticle)
// getArticleById 取得個別文章
router.get('/:id', getArticleById)
// get 順序需先 /all 再 /:id 否則 all 會被當成 id
// editArticle 編輯文章
router.patch('/:id', upload, editArticle)
// router.post('/:id', auth , upload, editArticle)

export default router
