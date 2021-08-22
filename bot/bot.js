import linebot from 'linebot'
import dotenv from 'dotenv'
// import axios from 'axios'
import fs from 'fs'

// 設定環境變數 .env 檔案
dotenv.config()
const bot = linebot({
  channelId: process.env.CHANNEL_ID_BOT,
  channelSecret: process.env.CHANNEL_SECRET_BOT,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN_BOT
})

// 監聽進來的請求
// bot.listen('/', process.env.PORT, () => {
//   console.log('Bot start ' + process.env.PORT)
// })

bot.on('message', event => {
  console.log(event)
  console.log(event.source.profile)
  console.log(event.source.member)
  // event.reply(event.message.text + ' ' + event.message.id)

  if (event.type === 'message') {
    try {
      if (event.message.type === 'text') {
        const flex = [{
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'image',
                url: 'https://picsum.photos/600/600/?random=1',
                size: 'full',
                aspectMode: 'cover',
                aspectRatio: '1:1',
                gravity: 'center'
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${event.message.text}`,
                            size: 'xl',
                            color: '#ffffff'
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                              {
                                type: 'text',
                                text: `${event.message.id}`,
                                color: '#ffffff',
                                size: 'md',
                                flex: 0,
                                align: 'end'
                              // },
                              // {
                              //   type: 'text',
                              //   text: `${event.timestamp}`,
                              //   color: '#a9a9a9',
                              //   decoration: 'line-through',
                              //   size: 'sm',
                              //   align: 'end'
                              }
                            ],
                            flex: 0,
                            spacing: 'lg'
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                              {
                                type: 'text',
                                text: `${event.timestamp}`,
                                color: '#a9a9a9',
                                decoration: 'line-through',
                                size: 'sm',
                                align: 'end'
                              }
                            ],
                            flex: 0,
                            spacing: 'lg'
                          }
                        ]
                      }
                    ],
                    spacing: 'xs'
                  }
                ],
                position: 'absolute',
                offsetBottom: '0px',
                offsetStart: '0px',
                offsetEnd: '0px',
                paddingAll: '20px'
              }
            ],
            paddingAll: '0px'
          }
        }]

        const message = {
          type: 'flex',
          altText: 'Postit…',
          contents: {
            type: 'carousel',
            contents: flex
          }
        }
        fs.writeFileSync(
          './fs/test-postit.json',
          JSON.stringify(message, null, 2)
        )
        event.reply(message)
      // } else {
      }
    } catch (error) {

    }
  }
})

export default bot
