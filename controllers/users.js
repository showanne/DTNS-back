import md5 from 'md5' // 加密套件
import jwt from 'jsonwebtoken' // 驗證套件
import users from '../models/users.js'

// signUp 註冊  / POST http://localhost:xx/users
export const signUp = async (req, res) => {
  // 先檢查進來的資料格式
  // 因為有些傳進來的資料沒有(!) ['content-type'] 所以要加判斷
  if (!req.headers['content-type'] ||
      !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({
      success: false,
      message: '資料格式不正確'
    })
    return
  }
  try {
    await users.create(req.body)
    res.status(200).send({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'validationError') {
      // 如果錯誤訊息是驗證錯誤
      // 錯誤的訊息的 key 值為欄位名稱，不固定
      // 用 Object.keys 取第一個驗證錯誤
      const key = Object.keys(error.errors)[0]
      // 取得第一筆 驗證錯誤訊息
      const message = error.errors[key].message
      res.status(400).send({
        success: true,
        message: message
      })
    } else if (error.name === 'MongoError' &&
               error.code === 11000) {
      // 如果錯誤訊息是Mongo錯誤 且 錯誤編號是 11000 (數字格式)
      res.status(400).send({
        success: true,
        message: '帳號已存在'
      })
    } else {
      res.status(500).send({
        success: true,
        message: '伺服器錯誤'
      })
    }
  }
  console.log('signUp 註冊')
}

// signIn 登入  /  POST http://localhost:xx/users/signIn
export const signIn = async (req, res) => {
  // 先檢查進來的資料格式
  // 因為有些傳進來的資料沒有(!) ['content-type'] 所以要加判斷
  if (!req.headers['content-type'] ||
      !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({
      success: false,
      message: '資料格式不正確'
    })
    return
  }
  try {
    // 從資料庫裡撈出，符合使用者登入時輸入的帳號
    const user = await users.findOne({ account: req.body.account }, '')
    // 如果有這個使用者
    if (user) {
      // 使用者輸入的密碼加密後是否是資料庫裡有存的加密後的密碼一樣
      if (user.password === md5(req.body.password)) {
        // 簽發驗證序號 有效期為7天
        const token = jwt.sign(
          // jwt 內容資料
          { _id: user._id.toString() },
          // 加密用的key
          process.env.SECRET,
          // jwt 設定有效期
          { expiresIn: '7 days' }
        )
        // 把序號存入使用者資料
        user.tokens.push(token)
        // 儲存之前不驗證就存入
        user.save({ validateBeforeSave: false })
        res.status(200).send({
          success: true,
          message: '登入成功',
          token,
          email: user.email,
          account: user.account,
          role: user.role
        })
      } else {
        // 登入失敗
        res.status(400).send({
          success: false,
          message: '密碼錯誤'
        })
      }
    } else {
      // 帳號打錯或沒註冊
      res.status(400).send({
        success: false,
        message: '帳號錯誤'
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: '伺服器錯誤'
    })
  }
  console.log('signIn 登入')
}

// SignOut 登出  /  DELETE http://localhost:xx/users/signOut
export const signOut = async (req, res) => {
  try {
    // req.user.tokens (登出時回傳的 tokens) 是不是不等於傳進來的
    // 如果不等於會被留下；等於的會被踢掉(登出後刪除 tokens)
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    // 儲存之前不驗證就存入
    req.user.save({ validateBeforeSave: false })
    res.status(200).send({
      success: true,
      message: ''
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: '伺服器錯誤'
    })
  }
  console.log('SignOut 登出')
}
