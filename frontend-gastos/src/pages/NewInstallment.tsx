import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewInstallment = () => {
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [numInstallments, setNumInstallments] = useState(3);
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/installments', {
        description,
        total_amount: parseFloat(totalAmount),
        num_installments: numInstallments,
        start_date: startDate,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Error al registrar compra en cuotas:', err);
      setError('Ocurrió un error al guardar la compra en cuotas');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Compra en cuotas</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Descripción:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div>
          <label>Monto total:</label>
          <input
            type="number"
            step="0.01"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Número de cuotas:</label>
          <input
            type="number"
            min="1"
            value={numInstallments}
            onChange={(e) => setNumInstallments(parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <label>Fecha de inicio:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Guardar compra en cuotas</button>
      </form>
    </div>
  );
};

export default NewInstallment;
