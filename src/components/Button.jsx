import React from 'react';
import '../styles/button.css';

const Button = ({ children, onClick , cssClass}) => (
  <button
    type="button"
    onClick={onClick}
    className={cssClass}
  >
    {children}
  </button>
);

export default Button;