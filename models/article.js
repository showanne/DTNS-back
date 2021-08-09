import mongoose from 'mongoose' // MongoDB 操作套件

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  // 文章類型
  template: {
    // 0 便利貼 #postIt
    // 1 美字美句分享 #share
    // 2 待辦事項 #todo
    // 3 心情隨筆 #diary
    // 4 筆記 #notes
    // 5 小說 #novel
    // 6 儲物清單 #storage
    type: Number,
    // 預設編輯為便利貼
    default: 0
    // required: [true, '請選擇模板'] // 會有預設值，不可能空白
  },
  title: {
    type: String
  },
  // 作者
  author: {
    type: String
  },
  // 來源 引用出處
  source: {
    type: String
  },
  // 公開分享
  share: {
    type: Boolean
  },
  image: {
    type: String
  },
  textarea: {
    type: String
  },
  text: {
    type: String
  },
  datepicker: {
    type: Date
    // type: String
  },
  select: {
    type: String
  },
  // 編輯日期
  date: {
    type: Date
  },
  // 被檢舉
  report: {
    type: Boolean
  },
  // 按讚人次
  likeNum: {
    type: Array
  },
  // 儲存人次
  saveNum: {
    type: Array
  },
  // 分享人次
  shareNum: {
    type: Array
  }
}, { versionKey: false })

export default mongoose.model('article', ArticleSchema)
