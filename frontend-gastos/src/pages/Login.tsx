import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../components/Login.css'
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.log(err)
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-box">
      <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>🔐</h1>
        <h2>Iniciar sesión</h2>

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>
        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #eee' }} />
        <p style={{ textAlign: 'center', fontSize: '14px' }}>
          ¿No tenés cuenta? <Link to="/register">Registrate acá</Link>
        </p>


      </form>
    </div>
  );
};

export default Login;
