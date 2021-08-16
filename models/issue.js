import mongoose from 'mongoose' // MongoDB 操作套件

const Schema = mongoose.Schema

const IssueSchema = new Schema({
  majorIssue: {
    type: String
  },
  // 暱稱
  nickname: {
    type: String
  },
  // 作者 / 會員中心用
  author: {
    type: String
  },
  // 是否為會員 / 會員中心用
  member: {
    type: Boolean
  },
  issueDescription: {
    type: String
  },
  // 回復的文字
  replyIssue: {
    type: String
  },
  // 待回復
  reply: {
    type: Boolean
  },
  // 編輯日期
  date: {
    type: Date
  }
}, { versionKey: false })

export default mongoose.model('issue', IssueSchema)
