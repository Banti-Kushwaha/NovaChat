import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";


export const signup = async(req, res) => {
    const { fullName, email, password } = req.body;

    try{
        // Validate input
        if(!fullName || !email || !password){
            return res.status(400).json({ message: "All fields are required!"});
        }

        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long!"});
        }

        // Check if email is valid: regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ message: "Invalid email format!"});
        }

        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "Email is already registered!"});
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if(newUser){
            generateToken(newUser._id, res); //Generate token and set cookie
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })


            //todo: send welcome email to user
            
        } else {
            return res.status(400).json({ message: "Error creating user!"});
        }
    } catch (error){
        return res.status(400).json({ message: "Error registering user!", error: error.message});
    }
};

export const signin = async(req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required!"});
        }

        // Find user by email
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Invalid email or password!"});
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid email or password!"});
        }

        // Generate token and set cookie
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error){
        return res.status(400).json({ message: "Error signing in!", error: error.message});
    }
};