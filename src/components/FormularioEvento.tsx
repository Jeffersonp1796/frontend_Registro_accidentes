import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import API from '../api';
import './FormularioEvento.css';

interface FormData {
  fecha: string;
  tipo: string;
  lugar: string;
  persona_afectada: string;
  descripcion: string;
}

export default function FormularioEvento() {
  const [form, setForm] = useState<FormData>({
    fecha: '',
    tipo: '',
    lugar: '',
    persona_afectada: '',
    descripcion: '',
  });
  const [evidencia, setEvidencia] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidencia(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (evidencia) data.append('evidencia', evidencia);

    const res = await API.post('/eventos', data);
    console.log("res");
    console.log(res);
    
    alert('Evento registrado');
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-title">Registrar Evento</h2>

      <div className="form-group">
        <label htmlFor="fecha">Fecha:</label>
        <input type="date" id="fecha" name="fecha" onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="tipo">Tipo:</label>
        <select id="tipo" name="tipo" onChange={handleChange} required>
          <option value="">Seleccione tipo</option>
          <option value="accidente">Accidente</option>
          <option value="incidente">Incidente</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="lugar">Lugar:</label>
        <input type="text" id="lugar" placeholder="Lugar" name="lugar" onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="persona_afectada">Persona Afectada:</label>
        <input
          type="text"
          id="persona_afectada"
          placeholder="Persona afectada"
          name="persona_afectada"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          placeholder="Descripción del evento"
          name="descripcion"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="evidencia">Evidencia:</label>
        <input type="file" id="evidencia" onChange={handleFileChange} />
      </div>

      <button className="form-button" type="submit">
        Registrar
      </button>
    </form>
  );
}