import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddMember from './pages/AddMember';
import ViewMembers from './pages/ViewMembers';
import MemberDetails from './pages/MemberDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"       element={<Home />} />
            <Route path="/add"    element={<AddMember />} />
            <Route path="/view"   element={<ViewMembers />} />
            <Route path="/member/:id" element={<MemberDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
