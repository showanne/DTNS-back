import express from 'express' // 網頁伺服器
import mongoose from 'mongoose' // MongoDB 操作套件
import dotenv from 'dotenv'
import bodyParser from 'body-parsre' // 讀取傳入網頁伺服器的資料
import cors from 'cors' // 跨域套件

import userRouter from './routes/users'

dotenv.config()

// 資料庫連線
mongoose.connect(process.env.MONGODB)

const app = express()

// 設定前端來的跨域請求
app.use(cors({
  // orgin 為請求來源網域，callback 為是否允許
  // callback(錯誤訊息, 是否允許)
  origin (origin, callback) {
    // 如果是開發環境來的請求就全部允許
    if (process.env.DEV) {
      // 允許全部
      callback(null, true)
    } else {
      // 如果不是開發環境，再做判斷是從哪邊來的請求
      if (origin !== undefined &&
          origin.includes('github')) {
      // 如果是 github 來的請求就允許
        callback(null, true)
      } else {
        // 拒絕請求
        callback(new Error('請求不允許'), true)
      }
    }
  }
}))

// 處理 cors 的錯誤
app.use((_, req, res, next) => {
  res.status(403).send({
    success: false,
    message: '請求被拒絕'
  })
})

// bodyparser 將資料處理成 json 格式
app.use(bodyParser.json())

// 處理 bodyparser 的錯誤
// function 一定要放四個東西 error, req, res, next
// _ = error = Express 發生的錯誤
// error 一定要寫，但是不使用的話 可以 _ 替代
// next = 是否要繼續下一個步驟，使用方式為 next()
app.use((_, req, res, next) => {
  res.status(400).send({
    success: false,
    message: '內容格式錯誤'
  })
})

// 根據傳進來的路由判斷由哪個預設的請求來回應
app.use('/users', userRouter)

// 擋住 404 不要讓 express 去處理
// '*' 表示全部
app.all('*', (req, res) => {
  res.status(404)({
    success: false,
    message: '找不到內容'
  })
})

app.listen(process.env.PORT, () => {
  console.log('start：' + process.env.PORT)
})
