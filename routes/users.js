import express from 'express'
import auth from '../middleware/auth.js'
import {
  signUp,
  signIn,
  signInLine,
  signInLineData,
  signOut,
  getUsers
  // extend
} from '../controllers/users.js'

const router = express.Router()

// '/' = '/users'
// router.請求方式(路徑, 處理function)

// signUp 註冊
router.post('/', signUp)
// signIn 登入
router.post('/signIn', signIn)
router.get('/signInLineData', signInLineData)
router.get('/signInLine', signInLine)
// signOut 登出
router.delete('/signOut', auth, signOut)
// getUsers 取得所有使用者
router.get('/', auth, getUsers)
// extend
// router.post('/extend', auth, extend)

export default router
