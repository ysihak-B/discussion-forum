import User from "../model/user.js";

// get all users
export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});
      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

// delete user
export const deleteUser = async () => {
    try {
      const deleteQuestion = await Question.deleteMany({});
      const deleteReply = await Reply.deleteMany({});
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }; 