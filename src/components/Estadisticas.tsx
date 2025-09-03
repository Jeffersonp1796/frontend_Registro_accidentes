import { useEffect, useState } from 'react';
import API from '../api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { Evento } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Estadisticas() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    API.get<Evento[]>('/eventos')
      .then(res => setEventos(res.data))
      .catch(err => console.error('Error al cargar eventos:', err));
  }, []);

  const total = eventos.length;
  const accidentes = eventos.filter(e => e.tipo === 'accidente').length || 0;
  const incidentes = eventos.filter(e => e.tipo === 'incidente').length || 0;

  if (total === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>📊 Estadísticas de Eventos</h2>
        <p style={styles.noDataText}>No hay datos disponibles para mostrar estadísticas.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Estadísticas de Eventos</h2>
      <div style={styles.statsContainer}>
        <p style={styles.statText}>Total de eventos: <strong>{total}</strong></p>
        <p style={styles.statText}>Accidentes: <strong style={{ color: 'red' }}>{accidentes}</strong></p>
        <p style={styles.statText}>Incidentes: <strong style={{ color: 'orange' }}>{incidentes}</strong></p>
      </div>
      <div style={styles.chartContainer}>
        <Pie
          data={{
            labels: ['Accidentes', 'Incidentes'],
            datasets: [
              {
                data: [accidentes, incidentes],
                backgroundColor: ['#FF6384', '#FFCE56'],
                hoverBackgroundColor: ['#FF4D6D', '#FFC233'],
                borderColor: '#ffffff',
                borderWidth: 2,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    const value = tooltipItem.raw as number;
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${tooltipItem.label}: ${value} (${percentage}%)`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333333',
    textAlign: 'center' as const,
  },
  statsContainer: {
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  statText: {
    fontSize: '1.2rem',
    margin: '5px 0',
    color: '#555555',
  },
  noDataText: {
    fontSize: '1.2rem',
    color: '#888888',
    textAlign: 'center' as const,
  },
  chartContainer: {
    width: '50%',
    maxWidth: '400px',
  },
};