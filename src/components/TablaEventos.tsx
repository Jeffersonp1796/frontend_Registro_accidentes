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
                <button onClick={() => onDetalle(e.id)}>Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}