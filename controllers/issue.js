// import jwt from 'jsonwebtoken' // 驗證套件
import issue from '../models/issue.js'
// import axios from 'axios'

// addIssue 新增問題 (訪客)  / POST http://localhost:xx/issue
export const addIssue = async (req, res) => {
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
    const result = await issue.create({
      majorIssue: req.body.majorIssue,
      nickname: req.body.nickname,
      issueDescription: req.body.issueDescription,
      member: false,
      reply: false,
      date: req.body.date
    })

    await issue.create(req.body)
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
  console.log('addIssue 新增問題 (訪客)')
}

// getIssue 取得問題 (訪客)  /  GET http://localhost:xx/issue
export const getIssue = async (req, res) => {
  console.log(req.params)
  try {
    // 尋找問題
    // find() 內可以指定搜尋條件 ex: member: false
    const result = await issue.find({ member: false })
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
  console.log('getIssue 取得問題 (訪客)')
}

// getIssueForManage 取得問題 (管理)  /  GET http://localhost:xx/issue/all
export const getIssueForManage = async (req, res) => {
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
    // 尋找問題
    // find() 內可以指定搜尋條件 ex: member: false
    const result = await issue.find()
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
  console.log('getIssueForManage 取得問題 (管理)')
}

// editIssueForManage 回復問題 (管理)  /  PATCH http://localhost:xx/issue
export const editIssueForManage = async (req, res) => {
  // console.log(req.body)
  // 驗證權限是否為管理員  1
  if (req.user.role !== 1) {
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
    // findByIdAndUpdate 尋找符合傳進來的 id 的那筆
    await issue.findOneAndUpdate(
      // 找到 issue 裡符合傳入的 ID
      {
        _id: req.body._id
      },
      // 將該筆改為傳入的數量， $ 代表符合查詢條件的索引
      {
        $set: {
          replyIssue: req.body.replyIssue,
          reply: req.body.reply
        }
      }
    )

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
  console.log('editIssueForManage 回復問題 (管理)')
}
