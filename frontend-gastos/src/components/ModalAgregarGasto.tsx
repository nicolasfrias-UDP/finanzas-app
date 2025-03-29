import { useState } from 'react';
import api from '../services/api'

interface Props {
    onClose: () => void;
    onSuccess: () => void;
  }

const ModalAgregarGasto = ({ onClose }: Props) => {
  const [tipo, setTipo] = useState<'comun' | 'cuotas' | 'fijo'>('comun');
  const [formComun, setFormComun] = useState({
    date: '',
    category: '',
    amount: '',
    description: ''
  });

  const [formCuotas, setFormCuotas] = useState({
    date: '',
    category: '',
    amount: '',
    description: '',
    installments: 1
  });

  const [formFijo, setFormFijo] = useState({
    start_date: '',
    category: '',
    amount: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, tipo: string) => {
    const { name, value } = e.target;
    if (tipo === 'comun') setFormComun({ ...formComun, [name]: value });
    if (tipo === 'cuotas') setFormCuotas({ ...formCuotas, [name]: value });
    if (tipo === 'fijo') setFormFijo({ ...formFijo, [name]: value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (tipo === 'comun') {
          await api.post('/expenses', { ...formComun, is_installment: false });
        } else if (tipo === 'cuotas') {
          await api.post('/installments', {
            ...formCuotas,
            installments: parseInt(formCuotas.installments.toString(), 10),
          });
        } else if (tipo === 'fijo') {
          await api.post('/fixed-expenses', { ...formFijo });
        }
      
        alert('Gasto creado con éxito ✅');
        onClose();
      } catch (err) {
        console.error('Error al guardar el gasto:', err);
        alert('Error al guardar el gasto ❌');
      }
      
      
    onClose();
  };

  return (
    <div style={backdrop}>
      <div style={modal}>
        <h2>Agregar gasto</h2>

        <div style={tabsContainer}>
          <button onClick={() => setTipo('comun')} style={tipo === 'comun' ? activeTab : tab}>Gasto común</button>
          <button onClick={() => setTipo('cuotas')} style={tipo === 'cuotas' ? activeTab : tab}>Compra en cuotas</button>
          <button onClick={() => setTipo('fijo')} style={tipo === 'fijo' ? activeTab : tab}>Gasto fijo</button>
        </div>

        <div style={{ marginTop: '16px' }}>
          {tipo === 'comun' && (
            <form onSubmit={handleSubmit} style={formStyle}>
              <label>Fecha:</label>
              <input type="date" name="date" value={formComun.date} onChange={(e) => handleChange(e, 'comun')} required />

              <label>Categoría:</label>
              <select name="category" value={formComun.category} onChange={(e) => handleChange(e, 'comun')} required>
                <option value="">Seleccionar</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Transporte">Transporte</option>
                <option value="Servicios">Servicios</option>
                <option value="Entretenimiento">Entretenimiento</option>
                <option value="Otro">Otro</option>
              </select>

              <label>Monto:</label>
              <input type="number" step="0.01" name="amount" value={formComun.amount} onChange={(e) => handleChange(e, 'comun')} required />

              <label>Descripción (opcional):</label>
              <input type="text" name="description" value={formComun.description} onChange={(e) => handleChange(e, 'comun')} />

              <div style={btnRow}>
                <button type="button" onClick={onClose} style={closeBtn}>Cancelar</button>
                <button type="submit" style={submitBtn}>Guardar</button>
              </div>
            </form>
          )}

          {tipo === 'cuotas' && (
            <form onSubmit={handleSubmit} style={formStyle}>
              <label>Fecha de la primera cuota:</label>
              <input type="date" name="date" value={formCuotas.date} onChange={(e) => handleChange(e, 'cuotas')} required />

              <label>Categoría:</label>
              <select name="category" value={formCuotas.category} onChange={(e) => handleChange(e, 'cuotas')} required>
                <option value="">Seleccionar</option>
                <option value="Electrónica">Electrónica</option>
                <option value="Electrodomésticos">Electrodomésticos</option>
                <option value="Muebles">Muebles</option>
                <option value="Otro">Otro</option>
              </select>

              <label>Monto total:</label>
              <input type="number" step="0.01" name="amount" value={formCuotas.amount} onChange={(e) => handleChange(e, 'cuotas')} required />

              <label>Número de cuotas:</label>
              <input type="number" name="installments" value={formCuotas.installments} onChange={(e) => handleChange(e, 'cuotas')} min={1} required />

              <label>Descripción (opcional):</label>
              <input type="text" name="description" value={formCuotas.description} onChange={(e) => handleChange(e, 'cuotas')} />

              <div style={btnRow}>
                <button type="button" onClick={onClose} style={closeBtn}>Cancelar</button>
                <button type="submit" style={submitBtn}>Guardar</button>
              </div>
            </form>
          )}

          {tipo === 'fijo' && (
            <form onSubmit={handleSubmit} style={formStyle}>
              <label>Fecha de inicio:</label>
              <input type="date" name="start_date" value={formFijo.start_date} onChange={(e) => handleChange(e, 'fijo')} required />

              <label>Categoría:</label>
              <select name="category" value={formFijo.category} onChange={(e) => handleChange(e, 'fijo')} required>
                <option value="">Seleccionar</option>
                <option value="Suscripciones">Suscripciones</option>
                <option value="Servicios">Servicios</option>
                <option value="Seguros">Seguros</option>
                <option value="Otro">Otro</option>
              </select>

              <label>Monto mensual:</label>
              <input type="number" step="0.01" name="amount" value={formFijo.amount} onChange={(e) => handleChange(e, 'fijo')} required />

              <label>Descripción (opcional):</label>
              <input type="text" name="description" value={formFijo.description} onChange={(e) => handleChange(e, 'fijo')} />

              <div style={btnRow}>
                <button type="button" onClick={onClose} style={closeBtn}>Cancelar</button>
                <button type="submit" style={submitBtn}>Guardar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarGasto;

// Estilos inline
const backdrop: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modal: React.CSSProperties = {
  background: 'white',
  padding: '24px',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
};

const tabsContainer: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginBottom: '16px'
};

const tab: React.CSSProperties = {
  flex: 1,
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  cursor: 'pointer',
  background: '#f5f5f5',
};

const activeTab: React.CSSProperties = {
  ...tab,
  background: '#1976d2',
  color: 'white',
  fontWeight: 'bold',
};

const closeBtn: React.CSSProperties = {
  background: 'white',
  border: '1px solid #ccc',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
};

const submitBtn: React.CSSProperties = {
  background: '#1976d2',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const btnRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px'
};
