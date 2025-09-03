import { useEffect, useState } from 'react';
import API from '../api';
import type { Evento } from '../types';
import './DetalleEvento.css';

interface Props {
  id: number;
  onVolver: () => void;
}

export default function DetalleEvento({ id, onVolver }: Props) {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Omit<Evento, 'id'>>({
    fecha: '',
    tipo: '',
    lugar: '',
    persona_afectada: '',
    descripcion: '',
    evidencia: ''
  });

  useEffect(() => {
    API.get<Evento>(`/eventos/${id}`).then(res => {
      setEvento(res.data);
      setFormData({
        fecha: res.data.fecha,
        tipo: res.data.tipo,
        lugar: res.data.lugar,
        persona_afectada: res.data.persona_afectada,
        descripcion: res.data.descripcion,
        evidencia: res.data.evidencia || ''
      });
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGuardar = async () => {
    try {
      const res = await API.put<Evento>(`/eventos/${id}`, formData);
      setEvento(res.data);
      setEditando(false);
      alert('Evento actualizado');
      onVolver();
    } catch (error) {
      alert('Error al actualizar el evento');
    }
  };

  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      await API.delete(`/eventos/${id}`);
      alert('Evento eliminado');
      onVolver();
    }
  };

  if (!evento) return null;

  return (
    <div className="detalle-evento-container">
      <h2 className="detalle-evento-title">Detalle del Evento</h2>

      {editando ? (
        <div className="detalle-evento-info">
          <label>
            Fecha:
            <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
          </label>
          <label>
            Tipo:
            <input type="text" name="tipo" value={formData.tipo} onChange={handleChange} />
          </label>
          <label>
            Lugar:
            <input type="text" name="lugar" value={formData.lugar} onChange={handleChange} />
          </label>
          <label>
            Persona Afectada:
            <input type="text" name="persona_afectada" value={formData.persona_afectada} onChange={handleChange} />
          </label>
          <label>
            Descripción:
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} />
          </label>
          {formData.evidencia && (
            <a
              className="detalle-evento-evidencia"
              href={`http://localhost:3001/uploads/${formData.evidencia}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver Evidencia
            </a>
          )}
        </div>
      ) : (
        <div className="detalle-evento-info">
          <p><strong>Fecha:</strong> {evento.fecha}</p>
          <p><strong>Tipo:</strong> {evento.tipo}</p>
          <p><strong>Lugar:</strong> {evento.lugar}</p>
          <p><strong>Persona Afectada:</strong> {evento.persona_afectada}</p>
          <p><strong>Descripción:</strong> {evento.descripcion}</p>
          {evento.evidencia && (
            <a
              className="detalle-evento-evidencia"
              href={`http://localhost:3001/uploads/${evento.evidencia}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver Evidencia
            </a>
          )}
        </div>
      )}

      <div className="detalle-evento-buttons">
        {editando ? (
          <>
            <button className="detalle-evento-button" onClick={handleGuardar}>Guardar</button>
            <button
              className="detalle-evento-button"
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            className="detalle-evento-button"
            onClick={() => setEditando(true)}
          >
            Editar
          </button>
        )}
        <button className="detalle-evento-button" onClick={handleEliminar}>Eliminar</button>
        <button className="detalle-evento-button" onClick={onVolver}>Volver</button>
      </div>
    </div>
  );
}