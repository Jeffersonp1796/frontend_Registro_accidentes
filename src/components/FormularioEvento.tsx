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
  estado: string;
  prioridad: string;
}

export default function FormularioEvento() {
  const [form, setForm] = useState<FormData>({
    fecha: '',
    tipo: '',
    lugar: '',
    persona_afectada: '',
    descripcion: '',
    estado: 'pendiente',
    prioridad: 'media'
  });
  const [evidencia, setEvidencia] = useState<File | null>(null);
  const [imagenesAdicionales, setImagenesAdicionales] = useState<File[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidencia(e.target.files[0]);
    }
  };

  const handleImagenesAdicionalesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImagenesAdicionales(prev => [...prev, ...files]);
    }
  };

  const removeImagenAdicional = (index: number) => {
    setImagenesAdicionales(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (evidencia) data.append('evidencia', evidencia);

    try {
      const res = await API.post('/eventos', data);
      console.log("Evento creado:", res.data);
      
      // Si hay imágenes adicionales, subirlas una por una
      if (imagenesAdicionales.length > 0 && res.data.id) {
        for (const imagen of imagenesAdicionales) {
          const imagenData = new FormData();
          imagenData.append('imagen', imagen);
          
          try {
            await API.post(`/eventos/${res.data.id}/imagenes`, imagenData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          } catch (error) {
            console.error('Error al subir imagen adicional:', error);
          }
        }
      }
      
      alert('Evento registrado exitosamente');
      
      // Limpiar formulario
      setForm({
        fecha: '',
        tipo: '',
        lugar: '',
        persona_afectada: '',
        descripcion: '',
        estado: 'pendiente',
        prioridad: 'media'
      });
      setEvidencia(null);
      setImagenesAdicionales([]);
      
    } catch (error) {
      console.error('Error al crear evento:', error);
      alert('Error al registrar el evento');
    }
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
          <option value="casi_accidente">Casi Accidente</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="estado">Estado:</label>
        <select id="estado" name="estado" onChange={handleChange} value={form.estado}>
          <option value="pendiente">Pendiente</option>
          <option value="en_revision">En Revisión</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="prioridad">Prioridad:</label>
        <select id="prioridad" name="prioridad" onChange={handleChange} value={form.prioridad}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
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
        <label htmlFor="evidencia">Imagen Principal:</label>
        <input type="file" id="evidencia" accept="image/*" onChange={handleFileChange} />
        {evidencia && (
          <div className="imagen-preview">
            <img 
              src={URL.createObjectURL(evidencia)} 
              alt="Preview" 
              style={{ width: '200px', height: '150px', objectFit: 'cover', marginTop: '10px' }}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="imagenes-adicionales">Imágenes Adicionales:</label>
        <input 
          type="file" 
          id="imagenes-adicionales" 
          accept="image/*" 
          multiple 
          onChange={handleImagenesAdicionalesChange} 
        />
        {imagenesAdicionales.length > 0 && (
          <div className="imagenes-adicionales-preview">
            <h4>Imágenes seleccionadas:</h4>
            {imagenesAdicionales.map((imagen, index) => (
              <div key={index} className="imagen-adicional-item">
                <img 
                  src={URL.createObjectURL(imagen)} 
                  alt={`Preview ${index + 1}`}
                  style={{ width: '150px', height: '100px', objectFit: 'cover', margin: '5px' }}
                />
                <button 
                  type="button" 
                  onClick={() => removeImagenAdicional(index)}
                  style={{ marginLeft: '10px' }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="form-button" type="submit">
        Registrar
      </button>
    </form>
  );
}