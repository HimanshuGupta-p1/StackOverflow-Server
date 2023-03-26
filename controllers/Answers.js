import mongoose from "mongoose";
import Questions from "../models/Questions.js";

export const postAnswer = async(req, res) => {
    const {id: _id} = req.params;

    const {noOfAnswers, answerBody, userAnswered, userId} = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('Question unavailable');
    }
    updateNoOfQuestion(_id, noOfAnswers)
    try {
        const updatedQuestion = await Questions.findByIdAndUpdate(_id, { $addToSet: {'answer': [{answerBody, userAnswered, userId}]}})
        res.status(200).json(updatedQuestion)
    } catch (error) {
        res.status(400).json('error in updating')
    }

}

const updateNoOfQuestion = async (_id, noOfAnswers) => {
    try {
        await Questions.findByIdAndUpdate(_id, {$set: {'noOfAnswers': noOfAnswers}})
    } catch (error) {
        console.log(error)
    }
}

export const deleteAnswer = async (req, res) => {
    const {id: _id} = req.params;
    const {answerId, noOfAnswers} = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('Question unavailable');
    }
    if (!mongoose.Types.ObjectId.isValid(answerId)){
        return res.status(404).send('Answer unavailable');
    }
    updateNoOfQuestion(_id, noOfAnswers)
    try{
        await Questions.updateOne(
            {_id},
            {$pull: {'answer': {_id: answerId}}}
        )
        res.status(200).json({message: "Successfully Deleted"})
    }
    catch(error){
        res.status(405).json(error)
    }
}