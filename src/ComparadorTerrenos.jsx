import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useCompare } from './contexto/CompareContext';
import './comparadorTerrenos.css';
import { formatearGuaranies } from './utils/formatters';

export const CompararTerrenos = () => {
  const { ids } = useParams();
  const navigate = useNavigate();
  const [terrenos, setTerrenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { compareList } = useCompare();

  const renderCheckIcon = (servicios, servicio) => {
    const existe = servicios?.includes(servicio);
    return existe ? (
      <span className='flex justify-center'><Check className="text-green-500 w-6 h-6" /></span>
    ) : (
      <span className='flex justify-center'><X className="text-red-500 w-6 h-6" /></span>
    );
  };

  // Limitar a 3 terrenos (tomar primeros 3)
  const displayedTerrenos = (compareList || []).slice(0, 3);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!displayedTerrenos.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-semibold mb-4">No hay terrenos para comparar</h2>
        <p className="text-neutral-600 mb-6">Agrega hasta 3 terrenos a la lista de comparación desde la página de resultados.</p>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="comparison-container">


          <table>
            <thead>
              <tr>
                <th></th>
                {displayedTerrenos.map((_, idx) => (
                  <th key={idx} className="property-column">Propiedad {idx + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Imagen</strong></td>
                {displayedTerrenos.map((terreno) => (
                  <td key={terreno._id} className="property-column">
                    <img
                      src={terreno.galeria_imagenes?.[0] || ''}
                      alt={terreno.titulo}
                      className="property-image"
                    />
                  </td>
                ))}
              </tr>

              <tr>
                <td>Título</td>
                {displayedTerrenos.map((terreno) => (
                  <td key={terreno._id} className="property-column">{terreno.titulo}</td>
                ))}
              </tr>

              <tr>
                <td>Precio</td>
                {displayedTerrenos.map((terreno) => (
                  <td key={terreno._id} className="property-column">
                    {terreno.cuota ? `Desde Gs. ${formatearGuaranies(terreno.cuota)}` : '-'}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Tipo de propiedad</td>
                {displayedTerrenos.map((terreno) => (
                  <td key={terreno._id} className="property-column">{terreno.tipo || 'Terrenos-Lotes'}</td>
                ))}
              </tr>

              <tr>
                <td>Ciudad</td>
                {displayedTerrenos.map((terreno) => (
                  <td key={terreno._id} className="property-column">{terreno.ciudad || '-'}</td>
                ))}
              </tr>

              <tr>
                <td>País</td>
                {displayedTerrenos.map((terreno) => (
                  <td key={terreno._id} className="property-column">{terreno.pais || 'Paraguay'}</td>
                ))}
              </tr>

              {/* Ejemplo de servicios/booleanos */}
              <tr>
                <td>Agua Potable</td>
                {displayedTerrenos.map((terreno) => (
                  <td key={terreno._id} className="property-column">
                    {renderCheckIcon(terreno.servicios, "Agua potable")}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Calles Empedradas</td>
                {displayedTerrenos.map((terreno) => (
                  <td key={terreno._id} className="property-column">
                    {renderCheckIcon(terreno.servicios, "Empedrado")}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Electricidad</td>
                {displayedTerrenos.map((terreno) => (
                  <td key={terreno._id} className="property-column">
                    {renderCheckIcon(terreno.servicios, "Electricidad")}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Zona Poblada</td>
                {displayedTerrenos.map((terreno) => (
                  <td key={terreno._id} className="property-column">
                    {renderCheckIcon(terreno.servicios, "Zona poblada")}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

