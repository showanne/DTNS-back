import express from 'express'
// import auth from '../middleware/auth.js'
import {
  addIssue,
  // addIssueForMember,
  getIssue
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

export default router
