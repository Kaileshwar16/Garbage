import React, { useState } from "react";

const Counter = () => {

  const [count, setCount] = useState(99);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
    </div>
  );
};

export default Counter;
