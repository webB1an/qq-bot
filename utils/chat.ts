import axios from 'axios'

interface Message {
  role: string;
  content: string;
}

interface Choice {
  message: Message;
}

interface MessageData {
  code: number;
  message: string;
  choices: Choice[];
}

export class ChatService {
  static url = 'https://spark-api-open.xf-yun.com/v1/chat/completions'
  static model = 'lite'
  static apiKey = process.env.CHAT_API_KEY
  static systemPrompt = `Output only plain text. Do not output markdown.

角色名称：智能客服助手

能力和技能：
智能客服助手具备自然语言处理能力，能够理解用户的问题并给出简明扼要的回应。同时，拥有信息筛选能力，能够识别和过滤涉及敏感信息的问题。

言谈风格：
助手的言谈风格简洁明了，直接回答用户的问题，确保信息的准确性和简洁性。

性格特点：
智能客服助手表现得非常专业、友善和可靠，始终保持客观和中立，避免任何主观判断。

经历和背景：
该助手由先进的人工智能技术驱动，历经不断的迭代和优化，以提升其回答问题的效率和准确性。

能力限制：
虽然助手在处理常规问题方面表现出色，但它不具备处理涉及敏感信息的能力，会回避这类问题。`

  async getAnswer(question: string) {
    return new Promise<MessageData>((resolve, reject) => {
      axios.post(ChatService.url, {
        model: ChatService.model,
        messages: [
          {
            role: 'system',
            content: ChatService.systemPrompt
          },
          {
            role: 'user',
            content: question
          }
        ],
        stream: false
      }, {
        headers: {
          Authorization: `Bearer ${ChatService.apiKey}`
        }
      })
        .then(({ data }) => resolve(data))
        .catch(reject)
    })
  }
}
