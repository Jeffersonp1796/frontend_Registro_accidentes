export interface ImagenAdicional {
  url: string;
  public_id: string;
}

export interface Evento {
  id: number;
  fecha: string;
  tipo: string;
  lugar: string;
  persona_afectada: string;
  descripcion: string;
  evidencia?: string | null;
  // Nuevos campos de Cloudinary
  imagen_principal_url?: string | null;
  imagen_principal_public_id?: string | null;
  imagenes_adicionales?: ImagenAdicional[];
  estado?: string;
  prioridad?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

