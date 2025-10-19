import IComment from './Comment';

interface IPost extends Document {
  _id: string;
  postSubject: string;
  postText: string;
  author: string;
  comments: IComment[];
}

export default IPost;