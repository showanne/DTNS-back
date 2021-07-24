import express from 'express'
import auth from '../middleware/auth'
import {
  signUp,
  signIn
} from '../controllers/users'

const router = express.Router()

// '/' = '/users'
// router.請求方式(路徑, 處理function)

// signUp 註冊
router.post('/', signUp)
// signIn 登入
router.post('/signIn', auth, signIn)

export default router
