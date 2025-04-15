import User from "../models/users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRound = 10;
const JWT_SECRET = process.env.JWT_SECRET || "theskyisblue";


export const register = async (req, res) => {

    try{
       
        const {email, password, role} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json('User with this email already exist please log in')
        };

        const hash = await bcrypt.hash(password, saltRound);

        const newUser = new User({
            email: email,
            password: hash,
            role: role
        });

        newUser.save();

        res.status(200).json({
            message: "User successfully Registered",
            user: {
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role
            }
        })


    }catch(error){
         
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        })

    }

};



export const login = async (req, res) => {

    try{

        
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "user not found"});

        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid user"});

        const token = jwt.sign({id: user._id, role: user.role, email: user.email}, JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                role: user.role,
                email: user.email
            }
        });


    }catch(error){
      res.status(500).json({
        message: "Internal Server error",
        error: error
      })
    }

}