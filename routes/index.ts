import express from 'express'
import type { Router } from 'express'
import kdocs from './kdocs'
const router: Router = express.Router()

// router.use('/cooker', cooker)
// router.use('/air', air)
// router.use('/keyboard', keyboard)

router.use('/kdocs', kdocs)

export default router
