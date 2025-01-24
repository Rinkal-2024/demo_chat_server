import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try{
        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 8 characters long"});
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message: "Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email ,
                profilePic: newUser.profilePic,
                message: "User Registered Successfully"
            });
        }else{
            return res.status(400).json({message: "Invalid User Data"});
        }
    }catch(error){
        console.log("error in signup controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async (req, res) => {
    const { email , password } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            message: "Logged In Successfully"
        })
    }catch(error){
        console.log("error in login controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const logout = (req, res) => {
    try{
        res.clearCookie('jwt' , "" , {maxAge:0})
        res.status(200).json({message: "Logged Out Successfully"});
    }catch(error){
        console.log("error in logout controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }

}

export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Please provide profile picture"});
        }
        const updateResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId , {profilePic :updateResponse.secure_url} , {new :true});
        res.status(200).json({message: "Profile Updated Successfully", user: updateUser});

    }catch(error){
        console.log("error in updateProfile controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("error in checkAuth controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}