import express from 'express'
import {AskQuestion, getAllquestions, deleteQuestion, voteQuestion} from '../controllers/Questions.js'
import auth from '../middleware/auth.js'
import { userOtpSend,userVerify } from '../controllers/Questions.js'


const router = express.Router()

router.post('/Ask',auth, AskQuestion)
router.post("/sendotp",userOtpSend)
router.post('/verifyotp',userVerify)
router.get('/get', getAllquestions)
router.delete('/delete/:id', auth, deleteQuestion)
router.patch('/vote/:id', auth, voteQuestion)

export default router