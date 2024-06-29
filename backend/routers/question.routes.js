import express from "express";
import {
  answerQuestion,
  askQuestion,
  dislikeQuestion,
  findQuestionsByTopic,
  getAllQuestions,
  getMyQuestions,
  likeQuestion,
} from "../controllers/question.controller.js";

const router = express.Router();

router.post("/ask-question", askQuestion);
router.post("/answer/:id", answerQuestion);
router.post("/upvote/:id", likeQuestion);
router.post("/downvote/:id", dislikeQuestion);
router.get("/questions", getAllQuestions);
router.get("/my-questions/:id", getMyQuestions);
router.get("/find/:topic", findQuestionsByTopic);

export default router;
