import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import {
  newEdit
} from '../controllers/article.js'

const router = express.Router()

// '/' = '/article'
// router.請求方式(路徑, 處理function)

// newEdit 新增文章 先驗證再做上傳
router.post('/', auth, upload, newEdit)

export default router
