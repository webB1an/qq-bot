import express from 'express'
import axios from 'axios'
import bcrypt from 'bcrypt' // 引入 bcrypt 库

import type { Router, Request, Response } from 'express'

const router: Router = express.Router()

router.post('/update', async(req: Request, res: Response) => {
  const hashedPassword = process.env.KDOCS_HASH_PASSWORD || ''
  console.log('update', req.body)
  const { type, name, link, password } = req.body
  if (!type || !password || !name || !link) {
    return res.send({
      code: 400,
      message: '参数错误'
    })
  }

  const isMatch = await bcrypt.compare(password, hashedPassword) // 比较密码
  if (!isMatch) {
    return res.send({
      code: 400,
      message: '密码错误'
    })
  }

  try {
    await axios.post(type, {
      name,
      link
    }, {
      headers: {
        'Origin': 'www.kdocs.cn'
      }
    })
    return res.send({
      code: 200,
      message: 'Success'
    })
  } catch (error) {
    return res.send({
      code: 400,
      message: error
    })
  }
})

export default router
