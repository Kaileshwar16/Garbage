import React from 'react';

function Footer() {
  // Get the current year automatically
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <hr />
      <p>© {currentYear} Money Planner. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
