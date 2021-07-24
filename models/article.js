import mongoose from 'mongoose' // MongoDB 操作套件

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  content: [{
    content: {
      type: Schema.Types.ObjectId,
      ref: 'content',
      required: [true, '沒有文章']
    }
  }],
  date: {
    type: Date
    // required: [true, '缺少編輯日期']
  }
})

export default mongoose.model('article', ArticleSchema)
