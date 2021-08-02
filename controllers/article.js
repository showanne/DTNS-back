export const newEdit = async (req, res) => {
  // 驗證權限是否為會員或管理員
  // 一般訪客 -1 / 一般會員 0 / 管理者 1
  if (req.user.role !== 1 || req.user.role !== 0) {
    res.status(403).send({ success: false, message: '沒有權限' })
    // 驗證沒過就不跑接下來的程式，也可以後面都用 else 包起來
    return
  }
  // 檢查進來的資料格式
  // 前端送出的資料類型 FormData 後端接收 multipart/form-data
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
  }
}
