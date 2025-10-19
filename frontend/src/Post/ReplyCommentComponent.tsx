import React, { ChangeEvent, useState } from 'react';
import { Button } from '@mui/material';
import postButtonBackground from '../assets/postButtonBackground.webp';
import IPost from '../interfaces/Post.ts';

type ReplyCommentProps = {
  postId: string;
  parentId: string;
  setPost: React.Dispatch<React.SetStateAction<IPost | null>>;
};

const ReplyCommentComponent : React.FC<ReplyCommentProps> = ({ postId, parentId, setPost }) => {
    const [commentText, setCommentText] = useState<string>('')
    const [isVisible, setIsVisible] = useState(false);  // State to toggle visibility

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setCommentText(e.target.value);  // Correctly update the state based on input
    };

    const addComment = async () => {
        if (commentText !== '') {
            try {
                const res = await fetch(`/api/post/${postId}/comment`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ comment: commentText, _replyId: parentId}),
                });
                if (!res.ok) {
                    throw new Error('Failed to post comment');
                }
                const newPost = await res.json();
                console.log(newPost)
                setPost(newPost);
                setIsVisible(false); 
                setCommentText('');
            } catch (error) {
                alert('Failed to post comment');
            }
        } else {
            alert('Please provide an comment before posting.');
        }
    };
    const toggleVisibility = () => {
      setIsVisible(!isVisible); // Toggle the visibility
    };

    return (
      <div style={{ width: '100%', padding: '10px', boxSizing: 'border-box', fontFamily: 'cursive'}}> 
        <div style={{ marginBottom: '2px' }}>
          <Button variant="text" onClick={toggleVisibility} style={{ width: '100%', fontSize: '10px', fontFamily: 'monospace'}}>
            {isVisible ? '-' : '+'}
          </Button>
        </div>
          {isVisible && (
            <div className="addCommentBlurb" style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <input
                className="Input" 
                style={{ flexGrow: 1, marginRight: '10px' }}
                type="text"
                value={commentText}
                onChange={handleInputChange}
                placeholder="Comment"
              />
              <Button variant="text" onClick={addComment} style={{ 
                whiteSpace: 'nowrap',
                fontFamily: 'cursive', 
                color: 'black', 
                backgroundImage: `url(${postButtonBackground})`,
                backgroundSize: '300%', // Ensure the image covers the button area
                filter: 'brightness(130%)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50% 80%', // Position the image at the bottom of the button
              }}> Post Comment
              </Button>
            </div>
          )}
      </div>
  );
      
  }

export default ReplyCommentComponent;