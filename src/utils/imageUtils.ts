/**
 * Utilidades para manejar imágenes adicionales
 */

export interface ImagenAdicional {
  url: string;
  public_id: string;
}

/**
 * Convierte imagenes_adicionales a array, manejando tanto string como array
 */
export function parseImagenesAdicionales(imagenesAdicionales: any): ImagenAdicional[] {
  if (!imagenesAdicionales) {
    return [];
  }
  
  if (typeof imagenesAdicionales === 'string') {
    try {
      return JSON.parse(imagenesAdicionales);
    } catch (e) {
      console.error('Error al parsear imágenes adicionales:', e);
      return [];
    }
  }
  
  if (Array.isArray(imagenesAdicionales)) {
    return imagenesAdicionales;
  }
  
  return [];
}

/**
 * Verifica si un evento tiene imágenes
 */
export function tieneImagenes(evento: any): boolean {
  return !!(
    evento.imagen_principal_url || 
    parseImagenesAdicionales(evento.imagenes_adicionales).length > 0 || 
    evento.evidencia
  );
}
