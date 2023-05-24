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

export const getUser = async (req, res) => {
    try {
      const { id:_id } = req.params;
      const user = await User.findById(_id);
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  export const getUserFriends = async (req, res) => {
    try {
      const { _id } = req.params;
      const allUsers = await User.find();
      res.status(200).json(allUsers);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  /* UPDATE */
  export const addRemoveFriend = async (req, res) => {
    try {
      const { id, friendId } = req.params;
      const user = await User.findById(id);
      const friend = await User.findById(friendId);
  
      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(id);
      }
      await user.save();
      await friend.save();
  
      // const friends = await Promise.all(
      //   user.friends.map((id) => User.findById(id))
      // );
      // const formattedFriends = friends.map(
      //   ({ _id, name }) => {
      //     return { _id,name  };
      //   }
      // );
      const allUsers = await User.find();
      res.status(200).json(allUsers);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
