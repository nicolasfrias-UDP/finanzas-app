import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../components/Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      alert('Registro exitoso ✅');
      navigate('/login');
    } catch (err) {
      console.log(err)
      alert('Error al registrar. Verificá los datos.');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-box">
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>📝</h1>
        <h2>Crear cuenta</h2>

        <label>Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <button type="submit">Registrarme</button>

        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: '#1976d2', fontWeight: 'bold', textDecoration: 'none' }}>
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;