import mongoose from 'mongoose' // MongoDB 操作套件
// import validator from 'validator' // 驗證套件
import md5 from 'md5' // 加密套件

const Schema = mongoose.Schema

const UserSchema = new Schema({
  // 帳號
  account: {
    // 資料型態
    type: String,
    // mongoose 內建的驗證
    // 最小長度 5 與自訂的錯誤訊息
    minlength: [5, '帳號最少須 5 個字'],
    // 最大長度 20 與自訂的錯誤訊息
    maxlength: [20, '帳號最多 20 個字'],
    // 必填與自訂的錯誤訊息
    // required: [true, '缺少帳號欄位'],
    // 設定不可重複，這裡的驗證無法使用自訂錯誤訊息，除非安裝套件
    unique: true
  },
  // 密碼
  password: {
    // 資料型態
    type: String,
    // 最小長度 4 與自訂的錯誤訊息
    minlength: [4, '密碼最少須 4 個字'],
    // 最大長度 20 與自訂的錯誤訊息
    maxlength: [20, '密碼最多 20 個字']
    // 必填與自訂的錯誤訊息
    // required: [true, '缺少密碼欄位']
  },
  email: {
    type: String
  //   required: [true, '缺少信箱欄位'],
    // unique: true,
  // 自訂驗證，安裝套件 npm i validator
  //   validate: {
  //     validator (value) {
  //       return validator.isEmail(value)
  //     },
  //     message: '信箱格式不正確'
  //   }
  },
  // 使用者分類
  role: {
    // 0 一般會員
    // 1 管理員
    type: Number,
    // 預設為一般會員
    default: 0,
    required: [true, '沒有使用者分類']
  },
  tokens: {
    type: [
      {
        access_token: String,
        refresh_token: String,
        id_token: String,
        jwt: String
      }
    ]
  },
  // 大頭貼
  avatar: {
    type: String
  },
  // LINE ID
  line: {
    type: String
  },
  // LINE 名字
  name: {
    type: String
  },
  editor: {
    type: [
      {
        article: {
          type: Schema.Types.ObjectId,
          ref: 'article'
          // required: [true, '沒有文章']
        }
      }
    ]
  }
}, { versionKey: false })
// 不要存改了幾次 v_1

// md5 加密使用者送出的密碼
UserSchema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = md5(user.password)
  }
  next()
})

export default mongoose.model('user', UserSchema)
