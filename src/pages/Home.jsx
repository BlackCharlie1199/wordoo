import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import GoogleButton from '../components/GoogleButton';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      navigate("/myword");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => navigate('/myword')} cssClass="btn btn-green">MyWord</Button>
      <Button onClick={() => navigate('/setting')} cssClass="btn btn-gray">Setting</Button>
      <GoogleButton onClick={handleLogin} cssClass="btn btn-green">Sign with Google</GoogleButton>
    </div>
  );
};

export default Home;