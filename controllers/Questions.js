import Questions from '../models/Questions.js'
import mongoose from 'mongoose'
import users from '../models/auth.js'
import { createTransport } from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

// email config


export const AskQuestion = async (req, res) => {
    const postQuestionData = req.body;
    // const {userId, noOfQues, dateAsked} = req.body;
    const postQuestion = new Questions(postQuestionData)

    try {
        await postQuestion.save();
        res.status(200).json('Question posted successfully')
    } catch (error) {
        console.log(error)
        res.status(400).json("Couldn't post a new question")
    }
}

export const getAllquestions = async (req, res) => {
    try {
        const questionList = await Questions.find();
        res.status(200).json(questionList);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('Question unavailable');
    }
    try {
        await Questions.findByIdAndRemove(_id);
        res.status(200).json({ message: "successfully deleted..." })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const voteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    const { value, userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('Question unavailable');
    }
    try {
        const question = await Questions.findById(_id);
        const upIndex = question.upVote.findIndex((id) => id === String(userId))
        const downIndex = question.downVote.findIndex((id) => (id === String(userId)))

        if (value === 'upVote') {
            if (downIndex !== -1) {
                question.downVote = question.downVote.filter((id) => id !== String(userId))
            }
            if (upIndex === -1) {
                question.upVote.push(userId)
            }
            else {
                question.upVote = question.upVote.filter((id) => id !== String(userId))
            }
        }
        else if (value === 'downVote') {
            if (upIndex !== -1) {
                question.upVote = question.upVote.filter((id) => id !== String(userId))
            }
            if (downIndex === -1) {
                question.downVote.push(userId)
            }
            else {
                question.downVote = question.downVote.filter((id) => id !== String(userId))
            }
        }
        await Questions.findByIdAndUpdate(_id, question)
        res.status(200).json({ message: "Voted Successfully..." })
    } catch (error) {
        res.status(404).json({ message: "Id not Found" })
    }
}

export const userVerify = async (req, res) => {
    const {_id, email, otp } = req.body;
    if (!otp || !email) {
        res.status(400).json({ error: "Please Enter Your OTP and email" })
    }
    try {
        const otpverification = await users.findById(_id);

        if (otpverification.otp === otp) {
            otpverification.otp = undefined
            await otpverification.save()
            res.status(200).json({ message: "User Login Succesfully Done"});

        } else {
            res.status(400).json({ error: "Invalid Otp" })
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
}


export const userOtpSend = async (req, res) => {
    const { _id, email } = req.body;
    if (!email) {
        console.log('a')
        res.status(400).json({ error: "Please Enter Your Email" })
    }


    try {
        const tarnsporter = createTransport({
            service: 'gmail',
            //    host: 'smtp.gmail.com',
            //    port: 465,
            //    secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const OTP = Math.floor(100000 + Math.random() * 900000);

        const updateData = await users.findByIdAndUpdate(_id, {
            otp: OTP
        }, { new: true }
        );
        await updateData.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: email.email,
            subject: "Sending Email For Otp Validation",
            text: `OTP:- ${OTP}`
        }


        tarnsporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error", error);
                res.status(400).json({ error: "email not send" })
            } else {
                console.log("Email sent", info.response);
                res.status(200).json({ message: "Email sent Successfully" })
            }
        })

        // else {

        //     const saveOtpData = new userotp({
        //         email, otp: OTP
        //     });

        //     await saveOtpData.save();
        //     const mailOptions = {
        //         from: process.env.EMAIL,
        //         to: email,
        //         subject: "Sending Eamil For Otp Validation",
        //         text: `OTP:- ${OTP}`
        //     }

        //     tarnsporter.sendMail(mailOptions, (error, info) => {
        //         if (error) {
        //             console.log("error", error);
        //             res.status(400).json({ error: "email not send" })
        //         } else {
        //             console.log("Email sent", info.response);
        //             res.status(200).json({ message: "Email sent Successfully" })
        //         }
        //     })
        // }
    } catch (error) {
        console.log('b')
        res.status(400).json({ error: "Invalid Details", error })
    }
};