import express from 'express'
import auth from '../middleware/auth.js'
import {
  newEdit
} from '../controllers/article.js'

const router = express.Router()

// '/' = '/article'
// router.請求方式(路徑, 處理function)

// newEdit 新增文章
router.post('/', auth, newEdit)

export default router
