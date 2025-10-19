import React, { ChangeEvent, useState } from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../Auth/useAuth.tsx';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../css/app.css';

type signupPageComponentProps = {
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const SignupPageComponent: React.FC<signupPageComponentProps> = ({setSignedIn}) => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const navigate = useNavigate()

  const signupAttempt = async () => {
    if (userName !== '' && passWord !== '') {
      try {
        const res = await fetch('/api/account/signup', {
          method: 'POST' ,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: userName, password: passWord }), // Send the username and password in the request body
        });
        if (!res.ok) {
          throw new Error('Signup failed'); // Or handle errors based on status code
        }
        setSignedIn(true); // Update the signedIn state
        navigate("/");

      } catch (error) {
        alert('signup failed')
      }
    } else {
      alert ('signup failed');
    }
    setUserName('');
    setPassWord('');
  }
  return (
    <>
      <div className="addCommentBlurb">
        <input
          className="Input"
          type="text"
          value={userName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
          placeholder="username"
          style={{marginTop: '10px', width: '75%'}}
        />
        <br></br>
        <input
          className="Input"
          type="password"
          value={passWord}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassWord(e.target.value)}
          placeholder="password"
          style={{marginTop: '10px', width: '75%', marginBottom: '10px'}}
        />
        <br></br>
        <Button variant="contained" style={
          {backgroundColor: 'green',}
        } onClick={signupAttempt}>Sign Up</Button>
      </div>
    </>
  );
}

const SignupComponent: React.FC = () => {
  const { signedIn, setSignedIn } = useAuth();
  const navigate = useNavigate();
  const switchLoginSignup = () => {
    navigate('/login');
  }

  return (
    <>
      {signedIn && <div>
        <h1> Successfully Signed In! </h1>
      </div>}

      {!signedIn && <div className='LoginComponent'>
        <div>
        <div style={{
            fontFamily: 'cursive',
            fontSize: '30px',
            marginTop: '10px',
          }}>
            Welcome to GoodVybez!
            </div>
            <div>
            Create an account to post.
          </div>
        </div>
        <SignupPageComponent setSignedIn={setSignedIn} />
        <Button variant='outlined' id='switchButton' onClick={switchLoginSignup} style={
          {
            backgroundColor: 'green',
            color: 'white',
          }
        }> Have an account? Sign In: </Button>
      </div>
        }
    </>
  )
}

export default SignupComponent;
