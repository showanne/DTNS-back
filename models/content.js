import mongoose from 'mongoose' // MongoDB 操作套件

const Schema = mongoose.Schema

const ContentSchema = new Schema({
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
    // required: [true, '沒有文章類型']
  },
  title: {
    type: String
  },
  public: {
    type: String
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
    type: String
  },
  select: {
    type: String
  }
}, { versionKey: false })

export default mongoose.model('content', ContentSchema)
