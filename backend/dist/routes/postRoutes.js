"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Post_1 = __importDefault(require("../models/Post"));
const Post_2 = require("../models/Post");
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_nlp_1 = require("node-nlp");
const router = express_1.default.Router();
const manager = new node_nlp_1.NlpManager({
  languages: ["en"],
  nlu: { log: false },
});
// Fetch all posts
router.get("/", async (req, res) => {
  try {
    const allQuestions = await Post_1.default.find();
    res.status(200).json(allQuestions);
  } catch (error) {
    res.status(500).json({ message: "Questions Cannot Load" });
  }
});
// Add a question
router.post("/add", requireAuth_1.default, async (req, res) => {
  const { postSubject, postText } = req.body;
  const author = req.session?.user?.username;
  if (!postText) {
    return res.status(400).json({ message: "Cannot use empty question text" });
  }
  if (!author) {
    return res.status(403).json({ message: "No author found in session" });
  }
  try {
    const sentimentResult = manager.process("en", postText);
    const addedPost = new Post_1.default({ postSubject, postText, author });
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
router.put("/:postId/comment", requireAuth_1.default, async (req, res) => {
  const { postId } = req.params;
  const { comment, _replyId } = req.body;
  console.log(postId, comment, _replyId);
  if (!comment) {
    return res.status(400).json({ message: "Comment text must be provided" });
  }
  try {
    const post = await Post_1.default.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log("here0");
    const sentimentResult = manager.process("en", comment);
    if (_replyId) {
      console.log("here1");
      const parentComment = findCommentById(post.comments, _replyId);
      console.log(parentComment);
      console.log("here2");
      console.log(parentComment, _replyId, post.comments);
      if (!parentComment) {
        return res.status(404).json({ message: "Reply comment not found" });
      }
      const newComment = new Post_2.Comment({
        commentText: comment,
        author: req.session?.user?.username,
        _replyId: new mongoose_1.default.Types.ObjectId(_replyId),
        parentCommentText: parentComment.commentText,
        parentCommentAuthor: parentComment.author,
      });
      post.comments.push(newComment);
      await post.save();
      return res.status(200).json(post);
    }
    const newComment = new Post_2.Comment({
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
    const post = await Post_1.default.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question" });
  }
});
router.delete("/:postId", requireAuth_1.default, async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.session?.user?.username;
    try {
      const post = await Post_1.default.findById(postId);
      if (!post) throw new Error("Could not find post.");
      if (user === post.author) {
        await Post_1.default.deleteOne({ _id: postId });
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
exports.default = router;
