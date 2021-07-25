import express from 'express'
// import auth from '../middleware/auth.js'
import {
  signUp,
  signIn
} from '../controllers/users.js'

const router = express.Router()

// '/' = '/users'
// router.請求方式(路徑, 處理function)

// signUp 註冊
router.post('/', signUp)
// signIn 登入
router.post('/signIn', signIn)

export default router
