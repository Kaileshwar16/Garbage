import React, { useState } from "react";

const Welcome = () => {

  const [message, setMessage] = useState("Hello, World!");

  const changeMessage = () => {
    setMessage("Hello, React!");
  };

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={changeMessage}>
        Change Message
      </button>
    </div>
  );
};

export default Welcome;
