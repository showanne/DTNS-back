import md5 from 'md5' // 加密套件
import jwt from 'jsonwebtoken' // 驗證套件
import users from '../models/users.js'
import axios from 'axios'
import Qs from 'qs'

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
    // console.log(req.body)
    await users.create(req.body)
    res.status(200).send({
      success: true,
      message: ''
    })
  } catch (error) {
    // console.log(error)
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
        console.log(token)
        // 把序號存入使用者資料
        user.tokens.push({ jwt: token })
        // 儲存之前不驗證就存入
        user.save({ validateBeforeSave: false })
        res.status(200).send({
          success: true,
          message: '登入成功',
          token,
          // email: user.email,
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
    console.log(req.user.tokens)
    req.user.tokens = req.user.tokens.filter(token => token.jwt !== req.token)
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

// signInLine Line登入  /  GET http://localhost:xx/users/signInLine
export const signInLine = async (req, res) => {
  try {
    //  Qs 將回傳的 JSON 轉 form-urlencoded 格式， line 才可以接收資料
    const options = Qs.stringify({
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: process.env.CALLBACK_URL,
      client_id: process.env.CHANNEL_ID,
      client_secret: process.env.CHANNEL_SECRET
    })

    // 跟 line 請求 使用者資料
    const { data } = await axios.post('https://api.line.me/oauth2/v2.1/token', options, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    //   "access_token": "" 有效期間為 30 天的 Access token。
    //   "expires_in": "" 過期之前的秒數。
    //   "token_type": "Bearer"
    //   "refresh_token": "" 取得新的 Access token，所需要的 Token。
    //   "scope": "openid profile" 使用者提供的權限
    //   "id_token": "" 包含用戶資訊的 JWT (Scopes 需有 openid)

    // 解析回傳的 id_Token
    const decoded = jwt.decode(data.id_token)

    //   "iss": "https://access.line.me 簽發 id_token",
    //   "sub": "我的 Line UserID",
    //   "aud": "CHANNEL_ID",
    //   "exp": token 有效期限,
    //   "iat": token 簽發時間,
    //   "amr": [ "line 登入方式" ],
    //   "name": "我的 Line User 顯示名稱",
    //   "picture": "我的 Line User 大頭貼"

    // 查詢是否有使用者資料有這個 line UserID (sub) 紀錄的 lineID ，順便寫入資料庫 line 欄位裡以便後續使用
    let result = await users.findOne({ line: decoded.sub })
    if (result === null) {
      // 如果是新使用者，就創建一個新帳號
      result = await users.create({ line: decoded.sub })
    }

    // 重新簽發一個我的 jwt
    const myjwt = jwt.sign(
      // jwt 內容資料
      { _id: result._id.toString() },
      // 加密用的key
      process.env.SECRET,
      // jwt 設定有效期為7天
      { expiresIn: '7 days' }
    )

    result.avatar = decoded.picture
    result.name = decoded.name

    // 把序號存入使用者資料
    result.tokens.push({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      id_token: data.id_token,
      jwt: myjwt
    })
    // 儲存之前不驗證就存入
    result.save({ validateBeforeSave: false })
    // 重新將請求導回前台
    res.redirect(process.env.FRONT_URL + '?jwt=' + myjwt)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: '伺服器錯誤'
    })
  }
  console.log('signInLine Line登入')
}

// signInLineData Line登入換資料  /  GET http://localhost:xx/users/signInLineData
export const signInLineData = async (req, res) => {
  // console.log(req)

  try {
    // 從 header 驗證取出 jwt，將 Bearer Token 取代成 Token
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ''
    // console.log(token)
    // 如果有 jwt
    if (token.length > 0) {
    // 解碼 jwt
      const decoded = jwt.verify(token, process.env.SECRET)
      // console.log(decoded)
      // 取出裡面紀錄的使用者 id
      const _id = decoded._id
      // 查詢是否有使用者資料有 jwt 紀錄的 _id
      req.user = await users.findOne({ _id })
      // console.log(req.user.name)

      res.status(200).send({
        success: true,
        message: '登入成功',
        // result: req.user
        token: token,
        name: req.user.name,
        avatar: req.user.avatar,
        role: req.user.role
      })
    } else {
    // 沒有 jwt，觸發錯誤，讓程式進 catch
      throw new Error()
    }
  } catch (error) {
    console.log(error)
    // .send() 送資料出去
    res.status(401).send({
      success: false,
      message: error
    })
  }
  console.log('signInLineData Line登入換資料')
}
// getUsers 取得所有使用者  /  GET http://localhost:xx/users
export const getUsers = async (req, res) => {
  // 驗證權限是否為管理員
  if (req.user.role !== 1) {
    res.status(403).send({
      success: false,
      message: '沒有權限'
    })
    // 驗證沒過就不跑接下來的程式，也可以後面都用 else 包起來
    return
  }
  try {
    // 尋找所有使用者
    const result = await users.find()
    res.status(200).send({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: '伺服器錯誤'
    })
  }
  console.log('getUsers 取得所有使用者')
}
