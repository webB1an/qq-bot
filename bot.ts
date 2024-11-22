import { AvailableIntentsEventsEnum } from 'qq-guild-bot'
import { Robot } from './robot'
import * as cron from 'node-cron'

import { Hitokoto } from './utils/hitokoto'
import { ChatService } from './utils/chat'
import { extractContent } from './utils'

const botConfig = {
  appID: process.env.BOT_APPID as string, // 申请机器人时获取到的机器人 BotAppID
  token: process.env.BOT_APPSECRET as string, // 申请机器人时获取到的机器人 BotToken
  intents: [AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES, AvailableIntentsEventsEnum.DIRECT_MESSAGE], // 事件订阅,用于开启可接收的消息类型
  sandbox: false // 沙箱支持，可选，默认false. v2.7.0+
}

const robot = new Robot(botConfig)
const hitokoto = new Hitokoto()
const chat = new ChatService()

robot.setAtMessagesHandler(async message => {
  const content = message.content

  if (content.includes('/一言')) {
    hitokoto.getHitokoto().then(txt => {
      robot.postMessage(message.channel_id, {
        content: `一言
${txt.hitokoto}
来自：${txt.from}
`,
        message_reference: {
          message_id: message.id
        }
      })
    }).catch(e => {
      console.log(e)
    })

    return
  }

  const answer = await chat.getAnswer(extractContent(content))
  robot.postMessage(message.channel_id, {
    content: answer?.choices?.[0]?.message?.content || '哦吼，出错啦~',
    message_reference: {
      message_id: message.id
    }
  })

  // 回复引用消息
  //   robot.postMessage(message.channel_id, {
  //     content: `一言
  // ${txt.hitokoto}`,
  //     message_reference: {
  //       message_id: message.id
  //     }
  //   })

  // 回复普通消息
  // robot.postMessage(message.channel_id, {
  //   content: txt.hitokoto,
  //   msg_id: message.id
  // })

  // 回复embed消息
  // const embedContent = Robot.createEmbedMessage('每日一言', '每日一言', 'https://qqchannel-profile-1251316161.file.myqcloud.com/17284661822634158995290497315569124561201/100?t=1728466182', [txt.hitokoto, txt.from, txt.from_who])
  // console.log('---', embedContent)
  // robot.postMessage(message.channel_id, {
  //   embed: embedContent,
  //   msg_id: message.id
  // })

  // 回复ark消息 需要申请权限
  // const arkContent = Robot.createArk23Message(['每日一言', txt.hitokoto, txt.from, txt.from_who])
  // robot.postMessage(message.channel_id, {
  //   ark: arkContent,
  //   msg_id: message.id
  // })
  // console.log('[PUBLIC_GUILD_MESSAGES] 收到消息 :', content)
})

cron.schedule('0 0 9 * * *', async() => {
  const txt = await hitokoto.getHitokoto()
  const channelIds = await robot.getAllChannelId()
  console.log('channelIds', channelIds)
  for (const channelId of channelIds) {
    robot.postMessage(channelId, {
      content: `新的一天早上好呀
一言：${txt.hitokoto}
来自：${txt.from_who}
`
    })
  }
})

// 每天早上8点给订阅的频道发送天气预报
// cron.schedule('0 0 9 * * *', async() => {
//   const channelId = await robot.getMyFirstChannelId()
// })
