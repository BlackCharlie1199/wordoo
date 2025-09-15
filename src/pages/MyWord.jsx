import React from "react";
import { loadUserLanguage } from "./helper";

const MyWord = () => {
  console.log(localStorage.getItem("language"));
  console.log(loadUserLanguage());

  return (
    <h1 className="text-2xl font-bold">MyWord Page</h1>
  )
};

export default MyWord;