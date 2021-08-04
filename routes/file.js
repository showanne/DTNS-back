import express from 'express'
import { getFile } from '../controllers/file.js'

const router = express.Router()

// getFile 取得上傳的圖片
router.get('/:file', getFile)

export default router
