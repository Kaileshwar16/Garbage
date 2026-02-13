import React from "react";
import Header from "./Header.jsx";
import Welcome from "./Welcome.jsx";
import Counter from "./Counter.jsx";

const App = () => {

  const handleClick = (e) => {
    console.log(e.target.innerText);
  };

  const handleClick2 = (name) => {
         console.log(`Thanks for the support ${name}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <Header />
        <Welcome />
        <Counter/>
      <button onClick={handleClick}>Click Me</button>
<p
  onDoubleClick={() => handleClick2("Raj")}
  style={{ marginTop: "30px", padding: "20px", border: "1px solid black", display: "inline-block", cursor: "pointer" }}
>
  Double-click me
</p>
    </div>
  );
};

export default App;
