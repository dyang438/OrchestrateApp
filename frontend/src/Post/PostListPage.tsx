import IPost from '../interfaces/Post.ts';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PostListPage.css';
import io, { Socket } from 'socket.io-client';

function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io('http://localhost:8000');

    socketRef.current.on('connect', () => {
      console.log('WebSocket Connected');
      socketRef.current?.emit('request-all-posts');  // You might need to handle this on the server
    });

    socketRef.current.on('all-posts', data => {
      setPosts(data.posts);  // Assuming the server sends all posts under 'posts' key
    });

    socketRef.current.on('error', err => {
      console.error('WebSocket Error:', err);
      setError('Failed to load posts');
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket Disconnected');
      setError('WebSocket Disconnected');
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const postRoute = (postId: string) => {
    navigate(`/post/${postId}`);
  }


  if (error) {
    console.error(error);
    return <div>Failed to load questions</div>;
  }
  if (!posts) return <div>Loading...</div>;

  return (
    <ul className='postList'>
      {posts.slice().reverse().map(( post : IPost ) => (
        <li key={post._id} className='postContainer'>
          <div id={'singlePost'} onClick={() => postRoute(post._id)}>
              <div style={{fontFamily:'cursive'}} >
              <div id='postSubject'>
                {post.postSubject}
              </div>
              <div id='postText'>
                {post.postText}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
export default PostListPage;
