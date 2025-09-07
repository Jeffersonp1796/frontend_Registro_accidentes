import { useEffect, useState } from 'react';
import type { Evento } from '../types.ts';
import API from '../api';
import './TablaEventos.css';

interface Props {
  onDetalle: (id: number) => void;
}

export default function TablaEventos({ onDetalle }: Props) {
  const [eventos, setEventos] = useState<Evento[]>([]);

  
  const fetchEventos = async () => {
    try {
      const res = await API.get<Evento[]>('/eventos');
      setEventos(res.data);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  };


  useEffect(() => {
    fetchEventos(); 

  
    const interval = setInterval(() => {
      fetchEventos();
    }, 5000);

  
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Lugar</th>
            <th>Persona</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Imágenes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((e) => (
            <tr key={e.id}>
              <td>{e.fecha}</td>
              <td>{e.tipo}</td>
              <td>{e.lugar}</td>
              <td>{e.persona_afectada}</td>
              <td>
                <span className={`estado-badge estado-${e.estado || 'pendiente'}`}>
                  {e.estado || 'Pendiente'}
                </span>
              </td>
              <td>
                <span className={`prioridad-badge prioridad-${e.prioridad || 'media'}`}>
                  {e.prioridad || 'Media'}
                </span>
              </td>
              <td>
                <div className="imagenes-indicador">
                  {e.imagen_principal_url && (
                    <span className="imagen-indicator" title="Imagen principal">📷</span>
                  )}
                  {e.imagenes_adicionales && e.imagenes_adicionales.length > 0 && (
                    <span className="imagen-indicator" title={`${e.imagenes_adicionales.length} imágenes adicionales`}>
                      📸 {e.imagenes_adicionales.length}
                    </span>
                  )}
                  {e.evidencia && (
                    <span className="imagen-indicator" title="Evidencia legacy">📁</span>
                  )}
                  {!e.imagen_principal_url && (!e.imagenes_adicionales || e.imagenes_adicionales.length === 0) && !e.evidencia && (
                    <span className="sin-imagen">Sin imágenes</span>
                  )}
                </div>
              </td>
              <td>
                <button onClick={() => onDetalle(e.id)}>Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}