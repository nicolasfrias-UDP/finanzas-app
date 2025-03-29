import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewExpense = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isInstallment, setIsInstallment] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/expenses', {
        date,
        category,
        amount: parseFloat(amount),
        description,
        is_installment: isInstallment
      });

      //navigate('/dashboard'); // volver a la lista de gastos
      navigate('/dashboard', { state: { refresh: true } });
    } catch (err) {
      console.error('Error al crear gasto:', err);
      setError('Ocurrió un error al guardar el gasto');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Agregar nuevo gasto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fecha:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div>
          <label>Categoría:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div>
          <label>Monto:</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div>
          <label>Descripción:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isInstallment}
              onChange={(e) => setIsInstallment(e.target.checked)}
            />
            Es una compra en cuotas
          </label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Guardar gasto</button>
      </form>
    </div>
  );
};

export default NewExpense;
