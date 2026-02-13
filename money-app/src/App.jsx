import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './style.css';
function App() {
  const words = ["grow", "invest", "earn", "make"];

  // Logic to pick the word
  const randomWord = words[Math.floor(Math.random() * words.length)];

  return (
    <div>

    <Header/>
      <h1>let's {randomWord} money</h1>
      <p>Refresh to change the word.</p>
    <Footer/>
    </div>
  );
}

export default App;
