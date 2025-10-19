import Post from "./models/Post";
import { Comment } from "./models/Post";
import mongoose from "mongoose";

// Copy of next function for now, change this

export const getAllPosts = async (socket) => {
  try {
    const posts = await Post.find().lean(); // Fetch all posts
    socket.emit("all-posts", { posts });
  } catch (error) {
    socket.emit("error", "Failed to fetch posts");
  }
};

export const handleRequestPost = async (socket, postId) => {
  try {
    const post = await Post.findById(postId).lean();
    socket.emit("post", { post });
  } catch (error) {
    socket.emit("error", { message: "Post not found" });
  }
};

export const handleNewComment = async (io, postId, commentData) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    const newComment = new Comment({
      commentText: commentData.comment,
      author: commentData.author,
      _replyId: commentData._replyId
        ? new mongoose.Types.ObjectId(commentData._replyId)
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
