import { useEffect, useState } from 'react';
import API from '../api';
import type { Evento, ImagenAdicional } from '../types';
import './DetalleEvento.css';

interface Props {
  id: number;
  onVolver: () => void;
}

export default function DetalleEvento({ id, onVolver }: Props) {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [editando, setEditando] = useState(false);
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
  const [formData, setFormData] = useState<Omit<Evento, 'id'>>({
    fecha: '',
    tipo: '',
    lugar: '',
    persona_afectada: '',
    descripcion: '',
    evidencia: '',
    imagen_principal_url: '',
    imagen_principal_public_id: '',
    imagenes_adicionales: [],
    estado: '',
    prioridad: ''
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
        evidencia: res.data.evidencia || '',
        imagen_principal_url: res.data.imagen_principal_url || '',
        imagen_principal_public_id: res.data.imagen_principal_public_id || '',
        imagenes_adicionales: res.data.imagenes_adicionales || [],
        estado: res.data.estado || '',
        prioridad: res.data.prioridad || ''
      });
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNuevaImagen(e.target.files[0]);
    }
  };

  const handleSubirImagenAdicional = async () => {
    if (!nuevaImagen) return;
    
    try {
      const formData = new FormData();
      formData.append('imagen', nuevaImagen);
      
      await API.post(`/eventos/${id}/imagenes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Recargar el evento para obtener las imágenes actualizadas
      const res = await API.get<Evento>(`/eventos/${id}`);
      setEvento(res.data);
      setNuevaImagen(null);
      alert('Imagen subida exitosamente');
    } catch (error) {
      alert('Error al subir la imagen');
    }
  };

  const handleEliminarImagen = async (publicId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      try {
        await API.delete(`/eventos/${id}/imagenes/${publicId}`);
        
        // Recargar el evento para obtener las imágenes actualizadas
        const res = await API.get<Evento>(`/eventos/${id}`);
        setEvento(res.data);
        alert('Imagen eliminada exitosamente');
      } catch (error) {
        alert('Error al eliminar la imagen');
      }
    }
  };

  const handleGuardar = async () => {
    try {
      let res;
      
      if (nuevaImagen) {
        // Si hay una nueva imagen, usar FormData
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'imagenes_adicionales') {
            formDataToSend.append(key, value as string);
          }
        });
        if (nuevaImagen) formDataToSend.append('evidencia', nuevaImagen);
        
        res = await API.put<Evento>(`/eventos/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Si no hay nueva imagen, enviar JSON normal
        res = await API.put<Evento>(`/eventos/${id}`, formData);
      }
      
      setEvento(res.data);
      setEditando(false);
      setNuevaImagen(null);
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
          <div className="imagen-upload-section">
            <label>
              Nueva Imagen Principal:
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            {nuevaImagen && (
              <div className="imagen-preview">
                <img 
                  src={URL.createObjectURL(nuevaImagen)} 
                  alt="Preview" 
                  style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
          
          {formData.evidencia && (
            <a
              className="detalle-evento-evidencia"
              href={`http://localhost:3001/uploads/${formData.evidencia}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver Evidencia (Legacy)
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
          {evento.estado && <p><strong>Estado:</strong> {evento.estado}</p>}
          {evento.prioridad && <p><strong>Prioridad:</strong> {evento.prioridad}</p>}
          
          {/* Imagen Principal */}
          {evento.imagen_principal_url && (
            <div className="imagen-principal">
              <h4>Imagen Principal:</h4>
              <img 
                src={evento.imagen_principal_url} 
                alt="Imagen principal del evento"
                style={{ width: '300px', height: '200px', objectFit: 'cover', marginBottom: '10px' }}
              />
            </div>
          )}
          
          {/* Imágenes Adicionales */}
          {evento.imagenes_adicionales && evento.imagenes_adicionales.length > 0 && (
            <div className="imagenes-adicionales">
              <h4>Imágenes Adicionales:</h4>
              <div className="imagenes-grid">
                {evento.imagenes_adicionales.map((imagen, index) => (
                  <div key={index} className="imagen-item">
                    <img 
                      src={imagen.url} 
                      alt={`Imagen adicional ${index + 1}`}
                      style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                    />
                    <button 
                      onClick={() => handleEliminarImagen(imagen.public_id)}
                      className="eliminar-imagen-btn"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Evidencia Legacy */}
          {evento.evidencia && (
            <a
              className="detalle-evento-evidencia"
              href={`http://localhost:3001/uploads/${evento.evidencia}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver Evidencia (Legacy)
            </a>
          )}
        </div>
      )}

      {/* Sección para subir imágenes adicionales */}
      {!editando && (
        <div className="subir-imagen-adicional">
          <h4>Subir Imagen Adicional:</h4>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            style={{ marginBottom: '10px' }}
          />
          {nuevaImagen && (
            <div>
              <img 
                src={URL.createObjectURL(nuevaImagen)} 
                alt="Preview" 
                style={{ width: '200px', height: '150px', objectFit: 'cover', marginBottom: '10px' }}
              />
              <br />
              <button onClick={handleSubirImagenAdicional} className="subir-imagen-btn">
                Subir Imagen
              </button>
            </div>
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