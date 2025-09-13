import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => navigate('/myword')} cssClass="btn btn-green">MyWord</Button>
      <Button onClick={() => navigate('/setting')} cssClass="btn btn-gray">Setting</Button>
    </div>
  );
};

export default Home;