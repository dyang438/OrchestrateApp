import mongoose, { Document, Schema } from "mongoose";

interface IComment extends Document {
  commentText: string;
  author: string;
  _replyId?: string;
  parentCommentText?: string;
  parentCommentAuthor?: string;
}

const CommentSchema: Schema = new Schema({
  commentText: { type: String, required: true },
  author: { type: String, required: true },
  _replyId: { type: String, required: false },
  parentCommentText: { type: String, required: false },
  parentCommentAuthor: { type: String, required: false },
});

interface IPost extends Document {
  postSubject: string;
  postText: string;
  author: string;
  comments: IComment[];
}

const PostSchema: Schema = new Schema({
  postSubject: { type: String, required: true },
  postText: { type: String, required: true },
  author: { type: String, required: true },
  comments: { type: [CommentSchema], required: false },
});

const Post = mongoose.model<IPost>("Post", PostSchema);
const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Post;
export { Comment };
