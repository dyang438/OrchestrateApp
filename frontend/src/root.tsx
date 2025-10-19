import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from './Auth/useAuth.tsx';
import LogoutButton from './Login/LogoutButton.tsx';
import PostListPage from './Post/PostListPage.tsx';
import PostDetailPage from "./Post/PostDetailPage.tsx";
import NewPostPage from './Post/NewPostPage.tsx';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

function Root() {
  const { signedIn } = useAuth();
  const navigate = useNavigate();

  const returnHome = () => {
    navigate('/');
  }

  const postCreation = () => {
    navigate('/addPost');
  }

  const signup = () => {
    navigate('/signup');
  }


  return (
    <>
      <nav>
        <Button onClick={returnHome} style={
          {position: 'fixed',
          top: '10px',
          left: '10px',
          fontSize: '20px',
          backgroundColor: 'green',}
        } variant="contained"> Home </Button>

        {signedIn && <Button variant="contained" onClick={postCreation} style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: 'green',
          fontSize: '20px',
        }}> Create Post</Button>}
        {!signedIn && <Button variant="contained" onClick={signup} style={
          {
            position: 'fixed',
            top: '10px',
            right: '10px',
            fontSize: '20px',
            backgroundColor: 'green',
          }
        }> Create an Account to Post </Button>}
        < LogoutButton />
      </nav>

      <Routes>
        <Route path="/" element={<PostListPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
        <Route path="/addPost" element={<NewPostPage />} />
      </Routes>
    </>
  );
}

export default Root;