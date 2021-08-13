import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import {
  newArticle,
  newArticleForMember,
  getArticle,
  getArticleByTemp,
  getArticleByTempForMember,
  getAllArticle,
  getArticleById,
  editArticleForManage,
  editArticleForMember,
  deleteArticleForMember
} from '../controllers/article.js'

const router = express.Router()

// '/' = '/article'
// router.請求方式(路徑, 處理function)

// newArticle 新增文章
router.post('/', upload, newArticle)
// newArticleForMember 新增文章 (會員)
router.post('/member', auth, upload, newArticleForMember)
// getArticle 取得文章 (訪客) 條件設定為有開放(share)的
router.get('/', getArticle)
// getArticleByTemp 取得指定分類的文章(訪客) 條件設定為有開放(share)的
router.get('/template/:template', getArticleByTemp)
// getArticleByTempForMember 取得指定分類的文章 (會員)
router.get('/member/template/:template', auth, getArticleByTempForMember)
// getAllArticle 取得所有文章 (管理者)
router.get('/all', auth, getAllArticle)
// getArticleById 取得個別文章
router.get('/:id', getArticleById)
// get 順序需先 /all 再 /:id 否則 all 會被當成 id
// editArticleForManage 移除文章 (管理)
router.patch('/all', auth, editArticleForManage)
// editArticle 編輯文章 (會員)
router.patch('/member/:id', auth, upload, editArticleForMember)
// deleteArticle 刪除文章 (會員)
router.delete('/member/:id', auth, deleteArticleForMember)

export default router
