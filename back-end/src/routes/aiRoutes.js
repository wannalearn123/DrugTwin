import express from 'express'
import { getAISuggestion } from '../controller/aiController.js'
import { protect, restrictTo } from '../middleware/authWare.js'

const router = express.Router()

router.get('/checkup/:id/ai-suggestion', protect, restrictTo(['doctor', 'admin']), getAISuggestion)

export default router