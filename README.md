# DTNS API

### 使用者相關(會員)
`POST`　/users/signIn

`GET`　/users/signInLineData

`GET`　/users/signInLine

`DELETE`　/users/signOut

`GET`　/users

`POST`　/users/extend

### 使用者相關(管理)
`POST`　/users

`GET`　/users/all

### 文章相關(訪客)
`POST`　/article

`GET`　/article

`GET`　/article/template/:template

`GET`　/article/id

### 文章相關(會員)
`POST`　/article/member

`GET`　/article/member/template

`PATCH`　/article/member/id

`DELETE`　/article/member/id

### 文章相關(管理)
`GET`　/article/all

`PATCH`　/article/all

### 檔案相關
`GET`　/file

### 問題相關
`POST`　/issue

`GET`　/issue

### 問題相關(管理)
`GET`　/issue/all

`PATCH`　/issue