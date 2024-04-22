// App.js
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './mainlayout'; // Adjust the path as necessary
import Dashboard from './dashboard'; // Adjust the path as necessary
import Booking from './booking'; // Ensure this path is correct

// Configure AWS Amplify
Amplify.configure(awsconfig);

function App() {
  const BasicWebsite = () => (
    <div>
      <h1>Welcome to Our Website</h1>
      <p>This is a basic view of our website. Please sign in to access the full features.</p>
    </div>
  );

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div className="App">
            {user ? (
              <Routes>
                <Route path="/" element={<MainLayout signOut={signOut} user={user} />}>
                  <Route index element={<Dashboard user={user} />} />
                  <Route path="/booking" element={<Booking user={user} />} />
                  {/* Define more authenticated routes here */}
                </Route>
              </Routes>
            ) : (
              <BasicWebsite />
            )}
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
