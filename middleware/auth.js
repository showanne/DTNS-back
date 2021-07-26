import jwt from 'jsonwebtoken'
import users from '../models/users.js'

// 用在驗證 jwt Token 及 jwt 解譯出的使用者帳號 這2者是否有在資料庫裡
export default async (req, res, next) => {
  try {
    // 從 header 驗證取出 jwt，將 Bearer Token 取代成 Token
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ''
    console.log(token)
    // 如果有 jwt
    if (token.length > 0) {
      // 解碼 jwt
      const decoded = jwt.verify(token, process.env.SECRET)
      // 取出裡面紀錄的使用者 id
      const _id = decoded._id
      // 查詢是否有使用者資料有 jwt 紀錄的 _id 以及該 jwt，順便寫入 req 裡以便後續使用
      req.user = await users.findOne({ _id, tokens: token })
      req.token = token
      if (req.user !== null) {
        // 有找到使用者就繼續處理請求
        next()
      } else {
        // 找不到就觸發錯誤，讓程式進 catch
        throw new Error()
      }
    } else {
      // 沒有 jwt，觸發錯誤，讓程式進 catch
      throw new Error()
    }
  } catch (error) {
    console.log(error)
    // .send() 送資料出去
    res.status(401).send({
      success: false,
      message: '驗證錯誤'
    })
  }
  console.log('auth 驗證')
}
