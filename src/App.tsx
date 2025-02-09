import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/AuthForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Profile } from './pages/Profile';
import { Rankings } from './pages/Rankings';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rankings" element={<Rankings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;