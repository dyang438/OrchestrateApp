interface IComment extends Document {
  _id: string;
  commentText: string;
  author: string;
  _replyId?: string;
  parentCommentText?: string;
  parentCommentAuthor?: string;
}

export default IComment;