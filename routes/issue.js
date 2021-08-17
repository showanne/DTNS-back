import express from 'express'
import auth from '../middleware/auth.js'
import {
  addIssue,
  // addIssueForMember,
  getIssue,
  getIssueForManage
} from '../controllers/issue.js'

const router = express.Router()

// '/' = '/issue'
// router.請求方式(路徑, 處理function)

// addIssue 新增問題 (訪客)
router.post('/', addIssue)
// addIssueForMember
// router.post('/member', auth, addIssueForMember)
// getIssue 取得問題 (訪客)
router.get('/', getIssue)
// getIssueForManage 取得問題 (管理)
router.get('/all', auth, getIssueForManage)

export default router
