import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import ModalAgregarGasto from '../components/ModalAgregarGasto';
interface Expense {
  id: number;
  date: string;
  category: string;
  amount: string;
  description: string;
}

const Dashboard = () => {
  const location = useLocation();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingFixed, setApplyingFixed] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [summary, setSummary] = useState<{ total: number; porCategoria: { category: string; total: number }[] }>(
    { total: 0, porCategoria: [] }
  );
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const today = new Date();
  const selectedMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expenses?month=${selectedMonth}`);
      setExpenses(res.data.expenses);
    } catch (error) {
      console.error('Error al obtener gastos', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFixedExpenses = async () => {
    setApplyingFixed(true);
    try {
      const res = await api.post('/fixed-expenses/apply-month');
      console.log('✅ Gastos fijos aplicados:', res.data);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error aplicando gastos fijos:', err);
      alert('Error al aplicar gastos fijos');
    } finally {
      setApplyingFixed(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/expenses/summary?month=${selectedMonth}`);
      const fixed = res.data.porCategoria.map((item: { category: string; total: string }) => ({
        ...item,
        total: parseFloat(item.total),
      }));
      setSummary({ total: res.data.total, porCategoria: fixed });
    } catch (err) {
      console.error('Error al obtener resumen mensual:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [location.state, refreshTrigger]);

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const groupedByCategory = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = [];
    acc[exp.category].push(exp);
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Hola, {user.name} 👋</h2>

      <button
        onClick={applyFixedExpenses}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        disabled={applyingFixed}
      >
        💥 Aplicar gastos fijos del mes
      </button>
      <button
        onClick={() => setShowModal(true)}
        style={{
          marginBottom: '16px',
          padding: '10px 20px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        ➕ Agregar gasto
      </button>

      <details open>
      <h3>Resumen mensual</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{
            flex: '1 1 200px',
            padding: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h4>Total gastado</h4>
            <p style={{ fontSize: '24px', margin: 0 }}>
              ${summary.total.toLocaleString()}
            </p>
          </div>

          {summary.porCategoria.map((cat) => (
            <div key={cat.category} style={{
              flex: '1 1 200px',
              padding: '16px',
              backgroundColor: '#f5f5f5',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}>
              <h4>{cat.category}</h4>
              <p style={{ fontSize: '20px', margin: 0 }}>
                ${cat.total.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </details>
      <details>
      <h3>Distribución por categoría</h3>
        <div style={{ width: '100%', height: 300, marginBottom: '30px' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={summary.porCategoria}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name }) => name}
              >
                {summary.porCategoria.map((_, index) => (
                  <Cell key={index} fill={`hsl(${index * 70}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </details>
      <details>      
        <h3>Gastos recientes (agrupados por categoría)</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : expenses.length === 0 ? (
          <p>No hay gastos registrados.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <div key={category}>
                <h4 style={{ borderBottom: '1px solid #ccc' }}>{category}</h4>
                {items.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px dashed #eee',
                    }}
                  >
                    <strong>${parseFloat(exp.amount).toLocaleString()}</strong> — {new Date(exp.date).toLocaleDateString()}
                    {exp.description && (
                      <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </details>
      {showModal && (
        <ModalAgregarGasto
          onClose={() => setShowModal(false)}
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}

    </div>
  );
};

export default Dashboard;
