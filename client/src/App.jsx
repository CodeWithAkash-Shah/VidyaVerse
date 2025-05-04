import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import Doubts from './pages/Doubts';
import AskQuestion from './pages/AskQuestion';
import AIHelper from './components/AIHelper';
import Events from './pages/Events';
import Notes from './pages/Notes';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './pages/Unauthorized';
import { useSelector } from 'react-redux';

function App() {
  const data = useSelector((state) => state.auth);
  const user = data?.user;

  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />}
        />

        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['student', 'teacher']}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Student-only routes */}
        <Route
          path="/notes"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Notes />
            </PrivateRoute>
          }
        />
        <Route
          path="/doubts"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Doubts />
            </PrivateRoute>
          }
        />
        <Route
          path="/ask-question"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <AskQuestion />
            </PrivateRoute>
          }
        />

        {/* Student and Teacher common route */}
        <Route
          path="/events"
          element={
            <PrivateRoute allowedRoles={['student', 'teacher']}>
              <Events />
            </PrivateRoute>
          }
        />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;