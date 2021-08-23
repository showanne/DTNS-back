import article from '../models/article.js'
import users from '../models/users.js'
import { inspect } from 'util' // 展開 [object Object] 套件

// newArticle 新增文章 (訪客)  /  POST http://localhost:xx/article
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
      author: req.body.author,
      avatar: req.body.avatar,
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
        success: false,
        message: '伺服器錯誤'
      })
    }
  }
  console.log('newArticle 新增文章 (訪客)')
}

// newArticleForMember 新增文章 (會員)  /  POST http://localhost:xx/article/member
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
    // let author = ''
    // if (req.user.name) {
    //   author = req.user.name
    // } else {
    //   author = req.user.account
    // }
    // 新增一筆回復，塞進 models
    const result = await article.create({
      template: req.body.template,
      title: req.body.title,
      author: req.body.author,
      avatar: req.body.avatar,
      share: req.body.share,
      publicOff: req.body.publicOff,
      image: req.filepath,
      textarea: req.body.textarea,
      text: req.body.text,
      datepicker: req.body.datepicker,
      select: req.body.select,
      date: req.body.date
    })
    req.user.editor.push({ article: result })
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
  console.log('newArticleForMember 新增文章 (會員)')
}

// getArticle 取得所有文章 (訪客)  /  GET http://localhost:xx/article
export const getArticle = async (req, res) => {
  console.log(req.params)
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
  console.log('getArticle 取得所有文章 (訪客)')
}

// getArticleByTemp 取得指定分類的文章 (訪客)  /  GET http://localhost:xx/article/template/:template
export const getArticleByTemp = async (req, res) => {
  try {
    // 尋找文章
    // find() 內可以指定搜尋條件
    const result = await article.find({
      share: true,
      template: req.params.template
    })
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
  console.log('getArticleByTemp 取得指定分類的文章 (訪客)')
}

// getArticleByTempForMember 取得指定分類的文章 (會員)  /  GET http://localhost:xx/article/member/template/:template
export const getArticleByTempForMember = async (req, res) => {
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
  console.log(req.params)
  try {
    // 尋找傳進來 id 的那位會員的資料，只取 editor 欄位
    // .populate 可以將 ref 欄位的資料帶出來 -> ref: 'article'
    const { editor } = await users.findById(req.user._id, 'editor').populate('editor.article')
    // console.log(editor)
    // const article = { ...editor }
    console.log('article' + inspect({ article }))

    // 尋找文章
    // find() 內可以指定搜尋條件
    // const articleTemp = article.find({
    //   template: req.params.template
    // })
    // const result = await article.find({
    //   share: true,
    //   template: req.params.template
    // })
    // console.log('articleTemp' + articleTemp)
    res.status(200).send({
      success: true,
      message: '',
      result: editor
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: '伺服器錯誤'
    })
  }
  console.log('getArticleByTempForMember 取得指定分類的文章 (會員)')
}

// getAllArticle 取得所有文章(管理者)  /  GET http://localhost:xx/article/all
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

// editArticleForManage 移除文章 (管理)  /  PATCH http://localhost:xx/article/:id
export const editArticleForManage = async (req, res) => {
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
    console.log(req.body)
    console.log(article)
    // findByIdAndUpdate 尋找符合傳進來的 id 的那筆
    await article.findOneAndUpdate(
      // 找到 article 裡符合傳入的文章 ID
      {
        _id: req.body.article
      },
      // 將該筆改為傳入的數量， $ 代表符合查詢條件的索引
      {
        $set: {
          publicOff: req.body.publicOff,
          share: req.body.share
        }
      }
    )
    // { new: true } 回傳新的結果
    res.status(200).send({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(500).send({
      success: true,
      message: '伺服器錯誤'
    })
  }
  console.log('editArticleForManage 移除文章 (管理)')
}

// editArticleForMember 編輯文章 (會員)  /  PATCH http://localhost:xx/article/member/:id
export const editArticleForMember = async (req, res) => {
  console.log(req.params.id)
  console.log(req.body)
  // NOTE: 訪客不需要編輯文章
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
      req.body._id,
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
  console.log('editArticleForMember 編輯文章 (會員)')
}

// deleteArticleForMember 刪除文章 (會員)  /  DELETE http://localhost:xx/article/member/id
export const deleteArticleForMember = async (req, res) => {
  try {
    await users.findOneAndUpdate(
      { 'editor.article': req.body.article },
      {
        // 刪除陣列，裡面放條件
        $pull: {
          // 要刪除的陣列的欄位名稱
          editor: {
            // 符合傳進來的 article
            article: req.body.article
          }
        }
      }
    )
    res.status(200).send({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(500).send({
      success: true,
      message: '伺服器錯誤'
    })
  }
  console.log('deleteArticleForMember 刪除文章 (會員)')
}

// getAllCarousel 取得首頁輪播所需圖片   /  GET http://localhost:xx/article/carousel
export const getAllCarousel = async (req, res) => {
  try {
    // 尋找所有文章
    // find() 內可以指定搜尋條件 ex: share: true
    const result = await article.find({
      template: 0
    })
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
  console.log('getAllCarousel 取得首頁輪播所需圖片')
}

// likeArticle 按讚文章 (會員)  /  PATCH http://localhost:xx/article/like/:id
export const likeArticle = async (req, res) => {
  // 驗證權限是否為會員 0
  if (req.user.role !== 0) {
    res.status(403).send({
      success: false,
      message: '沒有權限'
    })
    // 驗證沒過就不跑接下來的程式，也可以後面都用 else 包起來
    return
  }

  try {
    // 尋找傳進來 id 的那位會員的資料，只取 editor 欄位
    // .populate 可以將 ref 欄位的資料帶出來 -> ref: 'article'
    // const { editor } = await users.findById(req.user._id, 'editor').populate('editor.article')
    console.log(req.body)
    // findByIdAndUpdate 尋找符合傳進來的 id 的那筆
    await article.findOneAndUpdate(
      // 找到 article 裡符合傳入的文章 ID
      {
        _id: req.body.article
      },
      {
        $push: {
          likeNum: req.body.name
        },
        $pull: {
          likeNum: req.body.name
        }
      }
    )
    // req.user.editor.push({ article: result })
    // findByIdAndUpdate 尋找符合傳進來的 id 的那筆
    // const result = await article.findByIdAndUpdate(
    //   req.params.id,
    //   editData,
    //   { new: true }
    // )
    // { new: true } 回傳新的結果
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
    } else {
      res.status(500).send({
        success: true,
        message: '伺服器錯誤'
      })
    }
  }
  console.log('likeArticle 按讚文章 (會員)')
}
