import article from '../models/article.js'

// newArticle 新增文章  /  POST http://localhost:xx/article
export const newArticle = async (req, res) => {
  // TODO: 訪客不驗證避免無法傳入資料
  // 檢查進來的資料格式
  // 前端送出的資料類型 FormData 後端接收 multipart/form-data
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({
      success: false,
      message: '資料格式不正確'
    })
  }
  try {
    // TODO: 指定將文章創建進訪客身分區 user-1 (role: -1)
    // 新增一筆回復，塞進 models
    const result = await article.create({
      template: req.body.template,
      title: req.body.title,
      share: req.body.share,
      image: req.filepath,
      textarea: req.body.textarea,
      text: req.body.text,
      datepicker: req.body.datepicker,
      select: req.body.select,
      date: req.body.date
    })
    res.status(200).send({
      success: true,
      message: '',
      result
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
    } else {
      res.status(500).send({
        success: true,
        message: '伺服器錯誤'
      })
    }
  }
  console.log('newArticle 新增文章')
}

// newArticleForMember 新增文章  /  POST http://localhost:xx/article/member
export const newArticleForMember = async (req, res) => {
  // 驗證權限是否為會員或管理員
  // 一般訪客 -1 / 一般會員 0 / 管理者 1
  if (req.user.role === -1) {
    res.status(403).send({
      success: false,
      message: '沒有權限'
    })
    // 驗證沒過就不跑接下來的程式，也可以後面都用 else 包起來
    return
  }
  // 檢查進來的資料格式
  // 前端送出的資料類型 FormData 後端接收 multipart/form-data
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({
      success: false,
      message: '資料格式不正確'
    })
  }
  try {
    let author = ''
    if (req.user.name) {
      author = req.user.name
    } else {
      author = req.user.account
    }
    // 新增一筆回復，塞進 models
    const result = await article.create({
      template: req.body.template,
      title: req.body.title,
      author: author,
      share: req.body.share,
      image: req.filepath,
      textarea: req.body.textarea,
      source: req.body.source,
      text: req.body.text,
      datepicker: req.body.datepicker,
      select: req.body.select,
      date: req.body.date
    })
    req.user.editor.push(result)
    res.status(200).send({
      success: true,
      message: '',
      result
    })
    // 不驗證就存入
    await req.user.save({ validateBeforeSave: false })
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
    } else {
      res.status(500).send({
        success: true,
        message: '伺服器錯誤'
      })
    }
  }
  console.log('newArticleForMember 新增文章')
}

// getArticle 取得文章(一般會員看)  /  GET http://localhost:xx/article
export const getArticle = async (req, res) => {
  try {
    // 尋找文章
    // find() 內可以指定搜尋條件 ex: share: true
    const result = await article.find({ share: true })
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
  console.log('getArticle 取得文章')
}

// getAllArticle 取得所有文章(後台管理看)  /  GET http://localhost:xx/article/all
export const getAllArticle = async (req, res) => {
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
    // 尋找所有文章
    // find() 內可以指定搜尋條件 ex: share: true
    const result = await article.find()
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
  console.log('getAllArticle 取得所有文章')
}

// getArticleById 取得個別文章  /  GET http://localhost:xx/article/:id
export const getArticleById = async (req, res) => {
  try {
    // .findById() 尋找傳進來的那個 ID 的文章
    const result = await article.findById(req.params.id)
    res.status(200).send({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({
        success: false,
        message: '查無此文章'
      })
    } else {
      res.status(500).send({
        success: false,
        message: '伺服器錯誤'
      })
    }
  }
  console.log('getArticleById 取得個別文章')
}

// editArticle 編輯文章  /  PATCH http://localhost:xx/article/:id
export const editArticle = async (req, res) => {
  // NOTE: 訪客不需要編輯文章
  // 驗證權限是否為會員或管理員
  // 一般訪客 -1 / 一般會員 0 / 管理者 1
  if (req.user.role !== 1 || req.user.role !== 0) {
    res.status(403).send({
      success: false,
      message: '沒有權限'
    })
    // 驗證沒過就不跑接下來的程式，也可以後面都用 else 包起來
    return
  }
  // 檢查進來的資料格式
  // 前端送出的資料類型 FormData 後端接收 multipart/form-data
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({
      success: false,
      message: '資料格式不正確'
    })
  }
  try {
    const editData = {
      template: req.body.template,
      title: req.body.title,
      share: req.body.share,
      textarea: req.body.textarea,
      text: req.body.text,
      datepicker: req.body.datepicker,
      select: req.body.select,
      date: req.body.date
    }
    // 判斷如果傳進來的請求有 filepath (更新圖片)，才把圖片放進回傳結果，如果不加判斷會把原本的圖覆蓋掉
    if (req.filepath) editData.image = req.filepath

    // findByIdAndUpdate 尋找符合傳進來的 id 的那筆
    const result = await article.findByIdAndUpdate(
      req.params.id,
      editData,
      { new: true }
    )
    // { new: true } 回傳新的結果
    res.status(200).send({
      success: true,
      message: '',
      result
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
    } else {
      res.status(500).send({
        success: true,
        message: '伺服器錯誤'
      })
    }
  }
  console.log('editArticle 編輯文章')
}
