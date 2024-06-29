import User from "../model/user.js";

// create new user
export const signup = async (req, res) => {
    const { name, profileImage, password, email } = req.body;
    console.log("req.body", req.body);
    try {
      const findUser = await User.findOne({ name });
      if (findUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const newUser = await User.create({ name, profileImage, password, email });
      console.log(newUser)
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

// authenticate user
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const findUser = await User.findOne({ email });
      if (!findUser) {
        return res.status(400).json({ message: "User does not exist" });
      }
      if (findUser.password === password) {
        return res.status(200).json(findUser);
      }
      return res.status(400).json({ message: "Incorrect password" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }