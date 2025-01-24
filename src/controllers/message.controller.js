import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSideBar = async (req , res) =>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({_id: {$ne: loggedInUserId}}).select('--password');

        res.status(200).json(filteredUser);
    }catch(error){
        console.log("Error in getUsersForSideBar", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getConversation = async (req , res) =>{
    try{
        const {id: userToChatId} = req.params;
        const myId = req.user._id;
        console.log(myId , "myId")
        console.log(userToChatId , "userToChatId")
        const messages = await Message.find({
            $or: [
                {senderId :myId , receiverId : userToChatId} ,
                {senderId : userToChatId , receiverId : myId}
            ]
        })

        res.status(200).json(messages);

        // const userId = req.params.userId;
        // const loggedInUserId = req.user._id;

        // const conversation = await Message.find({$or: [{sender: userId, receiver: loggedInUserId}, {sender: loggedInUserId, receiver: userId}]}).populate('sender receiver');

        // res.status(200).json(conversation);
    }catch(error){
        console.log("Error in getConversation", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const sendMessage = async (req , res) =>{
    try{
        const {text, image} = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl ;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save();
        
        res.status(201).json(newMessage);

    }catch(error){
        console.log("Error in sendMessage", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}