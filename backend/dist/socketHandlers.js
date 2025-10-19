"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNewComment =
  exports.handleRequestPost =
  exports.getAllPosts =
    void 0;
const Post_1 = __importDefault(require("./models/Post"));
const Post_2 = require("./models/Post");
const mongoose_1 = __importDefault(require("mongoose"));
// Copy of next function for now, change this
const getAllPosts = async (socket) => {
  try {
    const posts = await Post_1.default.find().lean(); // Fetch all posts
    socket.emit("all-posts", { posts });
  } catch (error) {
    socket.emit("error", "Failed to fetch posts");
  }
};
exports.getAllPosts = getAllPosts;
const handleRequestPost = async (socket, postId) => {
  try {
    const post = await Post_1.default.findById(postId).lean();
    socket.emit("post", { post });
  } catch (error) {
    socket.emit("error", { message: "Post not found" });
  }
};
exports.handleRequestPost = handleRequestPost;
const handleNewComment = async (io, postId, commentData) => {
  try {
    const post = await Post_1.default.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    const newComment = new Post_2.Comment({
      commentText: commentData.comment,
      author: commentData.author,
      _replyId: commentData._replyId
        ? new mongoose_1.default.Types.ObjectId(commentData._replyId)
        : undefined,
      parentCommentText: commentData.parentCommentText,
      parentCommentAuthor: commentData.parentCommentAuthor,
    });
    post.comments.push(newComment);
    await post.save();
    io.emit("comment-updated", newComment); // Broadcast new comment to all clients
  } catch (error) {
    io.emit("error", { message: "Error handling comment" });
  }
};
exports.handleNewComment = handleNewComment;
