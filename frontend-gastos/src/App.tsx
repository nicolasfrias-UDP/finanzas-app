import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import NewExpense from './pages/NewExpense';
import NewInstallment from './pages/NewInstallment';
import NewFixedExpense from './pages/NewFixedExpense';
import Historial from './pages/Historial';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>            
          </PrivateRoute>
        }
      />
      <Route
      path="/expenses/new"
      element={
        <PrivateRoute>
          <MainLayout>
            <NewExpense />
          </MainLayout>          
        </PrivateRoute>
      }
    />
    <Route
      path="/installments/new"
      element={
        <PrivateRoute>
          <MainLayout>
            <NewInstallment />
          </MainLayout>          
        </PrivateRoute>
      }
    />
    <Route
      path="/fixed-expenses/new"
      element={
        <PrivateRoute>
          <MainLayout>
            <NewFixedExpense />
          </MainLayout>          
        </PrivateRoute>
      }
    />
    <Route
      path="/historial"
      element={
        <PrivateRoute>
          <MainLayout>
            <Historial />
          </MainLayout>          
        </PrivateRoute>
      }
    />
    </Routes>
  );
}

export default App;
