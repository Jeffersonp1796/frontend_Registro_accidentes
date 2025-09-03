export interface Evento {
  id: number;
  fecha: string;
  tipo: string;
  lugar: string;
  persona_afectada: string;
  descripcion: string;
  evidencia?: string | null;
}

