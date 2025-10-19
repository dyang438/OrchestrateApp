import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Auth/useAuth.tsx';
import { Button } from '@mui/material';
import IPost from '../interfaces/Post.ts';
import IComment from '../interfaces/Comment.ts';
import ReplyCommentComponent from './ReplyCommentComponent.tsx';
import '../css/PostDetailPage.css';
import io, { Socket } from 'socket.io-client';

// const fetcher = (url: string | URL | Request) => fetch(url).then((res) => res.json());

const PostDetailPage = () => {
  const { signedIn } = useAuth();
  const { postId } = useParams();
  const [post, setPost] = useState<IPost | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only attempt to connect if socketRef.current is not already initialized
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:8000'); // Adjust to your server's URL
    }
  
    if (socketRef.current) {
      socketRef.current.on('connect', () => {
        console.log('WebSocket Connected');
        socketRef.current?.emit('request-post', postId);  // Safely handle potential null
      });
  
      socketRef.current.on('post', (data) => {
        setPost(data.post);
      });
    
      socketRef.current.on('error', (message) => {
        console.error('WebSocket Error:', message);
      });
    }
  
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('post');
        socketRef.current.off('new-comment');
        socketRef.current.off('error');
        socketRef.current.disconnect();
        socketRef.current = null; // Clean up the ref
      }
    };
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  const AddCommentComponent : React.FC<{postId: string}> = ({postId}) => {
    const [comment, setComment] = useState<string>('')
    const [showAddCommentComponent, setShowAddCommentComponent] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value);  // Correctly update the state based on input)
    };


    const addComment = async () => {
      if (comment !== '') {
        try {
          const res = await fetch(`/api/post/${postId}/comment`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment }),
          });
          if (res.status == 406) {
            alert('Please try your best to adhere our positivity standards.');
            return; // Stop further execution
          }
          if (!res.ok) {
            throw new Error('Failed to post comment');
          }
          const updatedPost = await res.json(); // Assuming the response includes the newly added comment
          setPost(updatedPost);
          console.log('here');
          console.log(updatedPost);
          setComment('');
        } catch (error) {
          alert('Failed to post comment');
        }
      } else {
        alert('Please provide an comment before posting.');
      }
    };

    return (
      <>
        <div className='commentContainer'>
          <button id='commentOnThisPost' onClick={() => setShowAddCommentComponent(!showAddCommentComponent)}>
            Comment on this post:
          </button>
          {showAddCommentComponent && <div className="addCommentBlurb">
          <div >
            <textarea id='commentTextArea'
              value={comment}
              onChange={handleInputChange}
              placeholder="Comment"
            />
          </div>
          <br></br>
          <Button variant="contained" onClick={addComment} id='postCommentButton'>Post Comment</Button>
        </div>}
      </div>
      </>
    )
  }

  return (
    <div className={'postDetailContainer'} style={{fontFamily: 'cursive'}}>
      <div>
        <div id='postSubjectBlurb'>{post.postSubject}</div>
        <br></br>
        <div id='postTextBlurb'>{post.postText}</div>
        <h3 id='postAuthorBlurb'>{post.author}</h3>    
      </div>
      <div>
        {post.comments.map((comment: IComment) => (
          <div key={comment._id} className='comment'>
            <div style={{ border: '1px solid #ccc', borderRadius: '20px', padding: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            </div>
              {comment._replyId && (
                <>
                  <p style={{ marginBottom: '5px', color: '#888'}}>Replying to:</p>
                  <div style={{ border: '1px solid #999', fontStyle: 'italic', color: '#888' }}>
                    <p>{comment.parentCommentText}</p>
                    <h5>Author: {comment.parentCommentAuthor}</h5>
                  </div>
                </>
              )}
              <p style={{ fontWeight: 'bold', margin: 0, textAlign: 'left', marginTop: '10px'}}>{comment.author}</p>

              <p style={{ marginBottom: '5px', textAlign: 'left', fontSize: '20px'}}>{comment.commentText}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', marginTop: '5px' }}>
                {signedIn && <ReplyCommentComponent 
                  postId={postId as string} 
                  parentId={comment._id}   
                  setPost={setPost}
                />}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center-end',
      }}>
        {signedIn && <AddCommentComponent postId={postId as string} />}
      </div>
      {signedIn && <div id='padding'></div>}
    </div>
  );
};

export default PostDetailPage;
