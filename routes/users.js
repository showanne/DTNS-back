import express from 'express'
import auth from '../middleware/auth.js'
import {
  signUp,
  signIn,
  signInLine,
  signInLineData,
  signOut,
  getUsers,
  getUserInfo,
  extend
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
// getUsers 取得所有使用者資料
router.get('/all', auth, getUsers)
// getUserInfo 抓取使用者資料
router.get('/', auth, getUserInfo)
// extend 更新 token
router.post('/extend', auth, extend)

export default router
