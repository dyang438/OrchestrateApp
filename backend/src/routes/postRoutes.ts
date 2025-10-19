import express from "express";
import Post from "../models/Post";
import { Comment } from "../models/Post";
import requireAuth from "../middlewares/requireAuth";
import mongoose from "mongoose";
import { NlpManager } from "node-nlp";
import BadWordsFilter from "bad-words";
const filter = new BadWordsFilter();

const router = express.Router();
const manager = new NlpManager({ languages: ["en"], nlu: { log: false } });

// Fetch all posts
router.get("/", async (req, res) => {
  try {
    const allQuestions = await Post.find();
    res.status(200).json(allQuestions);
  } catch (error) {
    res.status(500).json({ message: "Questions Cannot Load" });
  }
});

// Add a question
router.post("/add", requireAuth, async (req, res) => {
  const { postSubject, postText } = req.body;
  const author = req.session?.user?.username;

  if (!postText) {
    return res.status(400).json({ message: "Cannot use empty question text" });
  }

  if (!author) {
    return res.status(403).json({ message: "No author found in session" });
  }

  if (filter.isProfane(postSubject) && filter.isProfane(postText)) {
    console.log("here111111");
    return res.status(406).json({ message: "Use of profanity is not allowed" });
  }

  try {
    const subjectSentimentResult = await manager.process("en", postSubject);
    const textSentimentResult = await manager.process("en", postText);
    console.log(subjectSentimentResult);
    console.log(textSentimentResult); // Log the result to see the structure and contents

    // Example condition to check if sentiment is negative

    if (
      subjectSentimentResult.sentiment &&
      textSentimentResult.sentiment &&
      textSentimentResult.sentiment.score +
        subjectSentimentResult.sentiment.score <
        0
    ) {
      // Handle negative sentiment case
      console.log("here");
      return res
        .status(406)
        .json({ message: "Negative sentiments are not allowed" });
    }

    const addedPost = new Post({ postSubject, postText, author });
    await addedPost.save();
    res.status(200).json(addedPost._id);
  } catch (error) {
    res.status(500).json({ message: "Error handling adding question" });
  }
});

function findCommentById(comments, id) {
  // Ensure id is a string for comparison, as ids in the array might be ObjectId
  const targetId = id.toString();
  for (let comment of comments) {
    if (comment._id.toString() === targetId) {
      return comment;
    }
  }
  return null;
}

// Comment on a post
router.put("/:postId/comment", requireAuth, async (req, res) => {
  const { postId } = req.params;
  const { comment, _replyId } = req.body;
  console.log(postId, comment, _replyId);
  if (!comment) {
    return res.status(400).json({ message: "Comment text must be provided" });
  }

  if (filter.isProfane(comment)) {
    console.log("here111111");
    return res.status(406).json({ message: "Use of profanity is not allowed" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log("here0");
    const commentSentimentResult = await manager.process("en", comment);

    if (
      commentSentimentResult.sentiment &&
      commentSentimentResult.sentiment.score < 0
    ) {
      // Handle negative sentiment case
      console.log("here");
      return res
        .status(406)
        .json({ message: "Negative sentiments are not allowed" });
    }

    if (_replyId) {
      console.log("here1");
      const parentComment = findCommentById(post.comments, _replyId);
      console.log(parentComment);
      console.log("here2");
      console.log(parentComment, _replyId, post.comments);
      if (!parentComment) {
        return res.status(404).json({ message: "Reply comment not found" });
      }
      const newComment = new Comment({
        commentText: comment,
        author: req.session?.user?.username,
        _replyId: new mongoose.Types.ObjectId(_replyId),
        parentCommentText: parentComment.commentText,
        parentCommentAuthor: parentComment.author,
      });

      post.comments.push(newComment);
      await post.save();
      return res.status(200).json(post);
    }
    const newComment = new Comment({
      commentText: comment,
      author: req.session?.user?.username,
    });

    post.comments.push(newComment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error updating the answer" });
  }
});

// get a post
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question" });
  }
});

router.delete("/:postId", requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.session?.user?.username;
    try {
      const post = await Post.findById(postId);
      if (!post) throw new Error("Could not find post.");

      if (user === post.author) {
        await Post.deleteOne({ _id: postId });
        return res.status(200).json({ message: "Successfully removed post." });
      }
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this post." });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting question" });
  }
});

export default router;
