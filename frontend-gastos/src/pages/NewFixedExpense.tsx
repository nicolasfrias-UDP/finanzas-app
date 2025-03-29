import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewFixedExpense = () => {
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/fixed-expenses', {
        description,
        amount: parseFloat(amount),
        category,
        start_date: startDate,
        end_date: endDate || null,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Error al registrar gasto fijo:', err);
      setError('Ocurrió un error al guardar el gasto fijo');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Nuevo gasto fijo mensual</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Monto:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Categoría:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Fecha de inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Fecha de fin (opcional):</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Guardar gasto fijo</button>
      </form>
    </div>
  );
};

export default NewFixedExpense;
