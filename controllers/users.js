import mongoose from "mongoose";
import User from '../models/auth.js'

export const getAllUsers = async(req, res) => {
    try {
        const allUsers = await User.find();
        const allUserDetail = []
        allUsers.forEach(users => {
            allUserDetail.push({_id: users._id, name: users.name, about: users.about, tags:users.tags, joinedOn: users.joinedOn,accountType: users.accountType,noOfQues:users.noOfQues,dateAsked: users.dateAsked})
        });
        res.status(200).json(allUserDetail);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const updateProfile = async (req,res) => {
    const {id :_id} = req.params;
    const {name, about, tags} = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('User not available');
    }
    try {
        const updatedProfile = await User.findByIdAndUpdate( _id, { $set: { 'name': name, 'about': about, 'tags': tags }}, { new: true } )        
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(405).json({message:error.message})
    }
}

export const updateUser = async (req,res) => {
    const {id :_id} = req.params;
    const {noOfQues, dateAsked} = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('User not available');
    }
    try {
        const updatedProfile = await User.findByIdAndUpdate(_id, { $set: { 'noOfQues': noOfQues, 'dateAsked' : dateAsked}}, { new: true } )   
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(405).json({message:error.message})
    }
}

