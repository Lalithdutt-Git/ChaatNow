import User from "../models/user.model.js";
import bcrypt, { genSalt } from "bcryptjs";
import { genToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import user from "../models/user.model.js";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must atleast be 6 characters." });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "email already used." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate tken
      genToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        password: newUser.password,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const hashedPassword = user.password;
      const isPassword = await bcrypt.compare(password, hashedPassword);
      if (!isPassword) {
        res.status(400).json({ message: "Invalid credentials." });
      }
      genToken(user._id, res);
      res.status(200).json({
        _id: user._id,
        fullname: user.fullName,
        password: user.password,
        email: user.email,
        profilePic: user.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out sucessfully" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req,res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;
    if(!profilePic) {
      return res.status(400).json({message: "No Profile pic added"});
    }
    const uploadedResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await user.findByIDAndUpdate(userId, {profilePic: uploadedResponse.secure_url},{new: true})
    res.status(200).json({message: "updated profile."})
  } catch (error) {
    console.log("error in update profile controller");
    res.status(400).json({message: "Internal server eroor"})
  }
};

export const checkAuth  = (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller",error);
        res.status(400).json({message: "Internal server error"});
    }
};