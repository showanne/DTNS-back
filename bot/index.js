import express from 'express' // 網頁伺服器
import bodyParser from 'body-parser' // 讀取傳入網頁伺服器的資料
import bot from './bot.js'

const router = express.Router()

router.use(bodyParser.json({
  verify (req, res, buf, encoding) {
    req.rawBody = buf.toString(encoding)
  }
}))

router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).send({ success: false, message: '格式錯誤' })
  } else { next() }
})

router.post('/', (req, res) => {
  bot.parse(req.body)
  return res.json({})
})

export default router
