import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export const SearchCard = ({ onSearch, searchFilters = {}, setSearchFilters }) => {
  const handleLocationChange = (value) => {
    setSearchFilters(prev => ({
      ...prev,
      ciudad: value
    }));
  };

  const handleServiceToggle = (service) => {
    setSearchFilters(prev => {
      const servicios = prev.servicios || [];
      const yaExiste = servicios.includes(service);
      
      return {
        ...prev,
        servicios: yaExiste 
          ? servicios.filter(s => s !== service)
          : [...servicios, service]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const serviciosSeleccionados = searchFilters.servicios || [];
    const ciudadIngresada = searchFilters.ciudad?.trim();

    // Validar que al menos tenga ciudad o servicios seleccionados
    // if (!ciudadIngresada && serviciosSeleccionados.length === 0) {
    //   alert('Por favor ingresa una ciudad o selecciona al menos un servicio');
    //   return;
    // }

    // Construir objeto de búsqueda dinámicamente
    const filtrosBusqueda = {};
    
    if (ciudadIngresada) {
      filtrosBusqueda.ciudad = ciudadIngresada;
    }
    
    if (serviciosSeleccionados.length > 0) {
      filtrosBusqueda.servicios = serviciosSeleccionados;
    }
    window.scrollTo({ top: 420, behavior: 'smooth' });
    onSearch(filtrosBusqueda);
  };

  const servicios = [
    { id: 'energia', label: 'Con Energía Eléctrica', icon: '⚡' },
    { id: 'internet', label: 'Con Internet', icon: '📡' },
    { id: 'agua', label: 'Agua Potable', icon: '💧' }
  ];

  const serviciosSeleccionados = searchFilters.servicios || [];

  return (
    <Card className="rounded-3xl">
      <form onSubmit={handleSubmit}>
        <CardContent className="p-5 grid md:grid-cols-12 gap-3 items-end">
          {/* Input de ciudad */}
          <div className="md:col-span-12">
            <Label className="mb-1 block">Ubicación <span className="text-gray-500 text-xs font-normal">(opcional)</span></Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />
              <Input 
                className="pl-9 rounded-2xl" 
                placeholder="Ingresa una ciudad"
                value={searchFilters.ciudad || ''}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
            </div>
          </div>

          {/* Filtros de servicios */}
          <div className="md:col-span-12 flex flex-wrap items-center gap-2 text-xs">
            {servicios.map(servicio => (
              <button
                key={servicio.id}
                type="button"
                onClick={() => handleServiceToggle(servicio.id)}
                className={`px-3 py-2 rounded-xl transition-all ${
                  serviciosSeleccionados.includes(servicio.id)
                    ? 'bg-blue-600 text-white border border-blue-700'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{servicio.icon}</span>
                {servicio.label}
              </button>
            ))}
            
            {/* Botón de buscar */}
            <Button 
              type="submit"
              className="ml-auto rounded-2xl"
            >
              <Search className="w-4 h-4 mr-2"/>
              Buscar
            </Button>
          </div>

          {/* Resumen de filtros seleccionados */}
          {serviciosSeleccionados.length > 0 && (
            <div className="md:col-span-12 text-xs text-gray-600 bg-blue-50 p-2 rounded-lg">
              <span className="font-semibold">Filtros activos:</span> {
                serviciosSeleccionados
                  .map(s => servicios.find(srv => srv.id === s)?.label)
                  .join(', ')
              }
            </div>
          )}
        </CardContent>
      </form>
    </Card>
  );
}