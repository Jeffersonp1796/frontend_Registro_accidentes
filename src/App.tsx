import { useState } from 'react';
import FormularioEvento from './components/FormularioEvento';
import TablaEventos from './components/TablaEventos';
import DetalleEvento from './components/DetalleEvento';
import Estadisticas from './components/Estadisticas';
import './App.css';

function App() {
  const [verDetalle, setVerDetalle] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'formulario' | 'tabla' | 'estadisticas'>('formulario');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Registro de Accidentes e Incidentes de Trabajo</h1>
      </header>

      <nav className="app-tabs">
        <button
          className={`tab-button ${activeTab === 'formulario' ? 'active' : ''}`}
          onClick={() => setActiveTab('formulario')}
        >
          Formulario
        </button>
        <button
          className={`tab-button ${activeTab === 'tabla' ? 'active' : ''}`}
          onClick={() => setActiveTab('tabla')}
        >
          Tabla de Eventos
        </button>
        <button
          className={`tab-button ${activeTab === 'estadisticas' ? 'active' : ''}`}
          onClick={() => setActiveTab('estadisticas')}
        >
          Estadísticas
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'formulario' && <FormularioEvento />}
        {activeTab === 'tabla' && (
          verDetalle ? (
            <DetalleEvento
              id={verDetalle}
              onVolver={() => setVerDetalle(null)}
              onEditar={(evento) => {
                console.log('Editar evento:', evento);
              }}
            />
          ) : (
            <TablaEventos onDetalle={setVerDetalle} />
          )
        )}
        {activeTab === 'estadisticas' && <Estadisticas />}
      </main>

      <footer className="app-footer">
        <p>© 2025 Registro de Accidentes. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;