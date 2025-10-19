// import { useState } from 'react';

import { ChangeEvent, useState } from 'react';
import { Button } from '@mui/material';
import '../css/app.css';
import { useNavigate } from 'react-router-dom';

function NewPostPage() {
  const [postSubject, setPostSubject] = useState('');
  const [postText, setPostText] = useState(''); 
  const navigate = useNavigate();

  const postAttempt = async () => {
    let data = null;
    if (postSubject !== '' && postText !== '') {
      try {
        // console.log(author);
        const res = await fetch('/api/post/add', {
          method: 'POST' ,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postSubject: postSubject, postText : postText}),
        });
        if (res.status == 406) {
          alert('Please try your best to adhere our positivity standards.');
          return; // Stop further execution
        }

        if (!res.ok) {
          throw new Error('post failed'); // Or handle errors based on status code
        }
        data = await res.json() as { token: string };
      } catch (error) {
        alert ('post failed');
      }
    } else {
      alert ('post failed');
    }
    setPostText('');
    setPostSubject('');
    if (data) {
      data
      navigate('/');
    }
  }

  return (
    <>
      <Button onClick={() => navigate('/')} style={
          {position: 'fixed',
          top: '10px',
          left: '10px',
          fontSize: '20px',
          backgroundColor: 'green',}
        } variant="contained"> Home </Button>
      <div className="addPostBlurb">
        <div className='subjectText'>
          <div style={{
          fontFamily: 'cursive'
        }}>Post Subject:</div>
        </div>
        <input
          className="Subject"
          type="text"
          value={postSubject}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPostSubject(e.target.value)}
          placeholder="Good Vybez Only!"
        />
        <br></br>
        <div className='textText'>
          <div style={{
          fontFamily: 'cursive'
        }}>Post Text:</div>
        </div>
        <textarea
          className="Text"
          value={postText}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPostText(e.target.value)}
          placeholder=""
        />
        <Button id='postButton' variant="outlined"  onClick={postAttempt}>Post</Button>
      </div>
    </>
  );
}

export default NewPostPage;