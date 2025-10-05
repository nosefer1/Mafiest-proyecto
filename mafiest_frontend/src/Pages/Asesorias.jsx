import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Asesorias = ({ user }) => {
  const [asesorias, setAsesorias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsesorias = async () => {
      try {
        const response = await axios.get('/api/asesorias', {
          headers: { Authorization: user?.token ? `Bearer ${user.token}` : undefined }
        });
        setAsesorias(response.data);
      } catch (err) {
        setError('No se pudieron cargar las asesorías');
      }
    };
    fetchAsesorias();
  }, [user]);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <h2 style={{ color: '#e94560', textAlign: 'center', fontWeight: 800 }}>Asesorías</h2>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {asesorias.length === 0 ? (
        <p>No hay asesorías disponibles.</p>
      ) : (
        <ul>
          {asesorias.map(asesoria => (
            <li key={asesoria.id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              <h4 style={{ margin: 0 }}>{asesoria.titulo}</h4>
              <p style={{ margin: 0 }}>{asesoria.descripcion}</p>
              <p style={{ margin: 0 }}>Fecha: {asesoria.fecha ? new Date(asesoria.fecha).toLocaleDateString() : 'Sin fecha'}</p>
              <p style={{ margin: 0 }}>Asesor: {asesoria.asesor?.nombre || 'Desconocido'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Asesorias;
