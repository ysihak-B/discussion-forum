import axios from "axios";
import React, { useState } from "react";
import { AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike } from 'react-icons/ai';

const LikeDislikeComponent = ({ question }) => {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const isliked = question?.upvote?.includes(userId)
  const isdisliked = question?.downvote?.includes(userId)
  const [liked, setLiked] = useState(isliked);
  const [disliked, setDisliked] = useState(isdisliked);

  const handleLikeClick = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/upvote/${question._id}`,
        {
          userId,
        }
      );
      console.log(res.status);
      if (res.status === 200) {
        setLiked(!liked);
        alert("Upvoted successfully");
      } else {
        setLiked(false)
        alert("You have reversed upvoting");
      }
    } catch (err) {
      console.log(err);
      alert("Can't upvote, please try again later");
    }
  };

  const handleDislikeClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/downvote/${question._id}`,
        {
          userId,
        }
      );
      console.log(res.status);
      if (res.status === 200) {
        setDisliked(!disliked);
        setLiked(false)
        alert("downvoted successfully");
      } else {
        setDisliked(false);
        alert("You have reversed downvoting");
      }
    } catch (err) {
      console.log(err);
      alert("Can't downvote, please try again later");
    }
  };
  return (
    <div>
      <button onClick={handleLikeClick} className="w-4 h-4 md:w-5 md:h-5 cursor-pointer dark:text-white">
        {liked ? <AiFillLike style={{ color: 'blue' }} /> : <AiOutlineLike style={{ color: 'blue' }} />}
      </button>
      <h3 className="text-sm md:text-base">
        {question?.upvote?.length || 0}
      </h3>
      <button onClick={handleDislikeClick}>
        {disliked ? <AiFillDislike style={{ color: 'red' }} /> : <AiOutlineDislike style={{ color: 'red' }} />}
      </button>
      <h3 className="text-sm md:text-base">
        {question?.downvote?.length || 0}
      </h3>
    </div>
  );
};

export default LikeDislikeComponent;