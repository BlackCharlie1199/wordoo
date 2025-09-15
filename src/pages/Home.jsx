import React, { useEffect, useState }from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { GoogleSignInButton, GoogleSignOutButton} from "../components/GoogleButton";
import { auth } from "../firebase";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut= async () => {
    await signOut(auth);
  };

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
      {user ? (
        <GoogleSignOutButton onClick={handleSignOut}>SignOut</GoogleSignOutButton>
      ) : (
        <GoogleSignInButton onClick={handleLogin} cssClass="btn btn-green">Sign with Google</GoogleSignInButton>
      )}
      
    </div>
  );
};

export default Home;