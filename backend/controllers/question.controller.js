import Question from "../model/question.js";
import Reply from "../model/reply.js";

// ask questions
export const askQuestion = async (req, res) => {
    const { question, description, userId, tags } = req.body;
    try {
      const newQuestion = await Question.create({
        question,
        description,
        author: userId,
        tags,
      });
      return res.status(201).json(newQuestion);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

//   reply questions
export const answerQuestion = async (req, res) => {
    const { answer, userId } = req.body;
  
    const { id: questionId } = req.params;
    try {
      const reply = await Reply.create({ reply: answer, author: userId });
      const findQuestion = await Question.findById(questionId);
      console.log("find", findQuestion);
      const addReply = await findQuestion.updateOne({
        $push: { replies: reply._id },
      });
      return res.status(201).json(reply);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

// get all questions
export const getAllQuestions = async (req, res) => {
    try {
      const questions = await Question.find({})
        .populate("replies")
        .populate({
          path: "replies",
          populate: {
            path: "author",
            model: "DiscussionUser",
          },
        })
        .populate("author")
        .sort({ createdAt: -1 });
      return res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

// get my questions
export const getMyQuestions = async (req, res) => {
    const { id: userId } = req.params;
    try {
      const replies = await Question.find({ author: userId })
        .populate("replies")
        .populate({
          path: "replies",
          populate: {
            path: "author",
            model: "User",
          },
        })
        .populate("author")
        .sort({
          createdAt: -1,
        });
      return res.status(200).json(replies);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

// like questions
export const likeQuestion = async (req, res) => {
    const { id: questionId } = req.params;
    const { userId } = req.body;
    try {
      const findQuestion = await Question.findById(questionId);
      if (findQuestion.upvote.includes(userId)) {
        const reverse = await findQuestion.updateOne({
          $pull: { upvote: userId },
        });
        return res.status(201).json({ message: "You have reversed upvoting" });
      }
  
      if (findQuestion.downvote.includes(userId)) {
        const downvote = await findQuestion.updateOne({
          $pull: { downvote: userId },
        });
        const upvote = await findQuestion.updateOne({
          $push: { upvote: userId },
        });
        return res.status(200).json({ message: "Response updated successfully" });
      }
  
      const upvote = await findQuestion.updateOne({
        $push: { upvote: userId },
      });
      return res.status(200).json(upvote);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

//  dislike questions
export const dislikeQuestion = async (req, res) => {
    const { id: questionId } = req.params;
    const { userId } = req.body;
    try {
      const findQuestion = await Question.findById(questionId);
      if (findQuestion.downvote.includes(userId)) {
        const reverse = await findQuestion.updateOne({
          $pull: { downvote: userId },
        });
        return res.status(201).json({ message: "You have reversed downvoting" });
      }
  
      if (findQuestion.upvote.includes(userId)) {
        const upvote = await findQuestion.updateOne({
          $pull: { upvote: userId },
        });
        const downvote = await findQuestion.updateOne({
          $push: { downvote: userId },
        });
        return res.status(200).json({ message: "Response updated successfully" });
      }
  
      const downvote = await findQuestion.updateOne({
        $push: { downvote: userId },
      });
      return res.status(200).json(downvote);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

// find questions by topic
export const findQuestionsByTopic = async (req, res) => {
    const { topic } = req.params;
    try {
      const questions = await Question.find({
        tags: {
          $in: [topic],
        },
      })
        .populate("replies")
        .populate({
          path: "replies",
          populate: {
            path: "author",
            model: "DiscussionUser",
          },
        })
        .populate("author")
        .sort({ createdAt: -1 });
      return res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }