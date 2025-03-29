import { useEffect, useState } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Expense {
  id: number;
  date: string;
  category: string;
  amount: string;
  description: string;
}

const Historial = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<{ total: number; porCategoria: { category: string; total: number }[] }>({
    total: 0,
    porCategoria: [],
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/expenses?month=${selectedMonth}`);
      setExpenses(res.data.expenses);
    } catch (err) {
      console.error('Error al cargar historial', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/expenses/summary?month=${selectedMonth}`);
      const parsed = res.data.porCategoria.map((cat: { category: string; total: string }) => ({
        ...cat,
        total: parseFloat(cat.total),
      }));
      setSummary({ total: res.data.total, porCategoria: parsed });
    } catch (err) {
      console.error('Error al cargar resumen', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [selectedMonth]);

  const groupedByCategory = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = [];
    acc[exp.category].push(exp);
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Historial de gastos 📆</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Seleccionar mes: </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

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

      <h3>Distribución por categoría</h3>
      {summary.porCategoria.length > 0 ? (
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
      ) : (
        <p style={{ fontStyle: 'italic', color: '#777' }}>
          No hay datos suficientes para mostrar el gráfico.
        </p>
      )}


      <h3>Gastos agrupados por categoría</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : expenses.length === 0 ? (
        <p>No hay gastos para este mes.</p>
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
    </div>
  );
};

export default Historial;
