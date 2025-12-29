import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SearchCard } from './SearchCard';

const landImages = [
  {
    url: "/images/yaaa.jpg",
    title: "Vista Panorámica",
    subtitle: "Desde 500 m²"
  },
  {
    url: "/images/yaaaaaa.jpg",
    title: "Frente al Lago",
    subtitle: "1200 m²"
  },
  {
    url: "/images/yaaaaaaaaaa.jpg",
    title: "Barrio Residencial",
    subtitle: "Todos los servicios"
  },
  {
    url: "/images/terreno2.webp",
    title: "Vista a las Montañas",
    subtitle: "Desde 800 m²"
  },
  {
    url: "/images/terreno3.webp",
    title: "Excelente Ubicación",
    subtitle: "Acceso asfaltado"
  },
  {
    url: "/images/terreno.jpg",
    title: "Centro Urbano",
    subtitle: "Financiación"
  }
];

function ImageGallery() {
  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Gradient overlay para fade en los bordes */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white dark:from-gray-950 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-white dark:from-gray-950 to-transparent" />
      </div>
      
      {/* Grid de imágenes con overflow */}
      <div className="grid grid-cols-2 gap-3 h-full pr-8">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer h-[200px] shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img 
              src={landImages[0].url}
              alt={landImages[0].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer h-[180px] shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img 
              src={landImages[1].url}
              alt={landImages[1].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer h-[160px] shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img 
              src={landImages[2].url}
              alt={landImages[2].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer h-[160px] shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img 
              src={landImages[3].url}
              alt={landImages[3].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer h-[240px] shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img 
              src={landImages[4].url}
              alt={landImages[4].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer h-[140px] shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img 
              src={landImages[5].url}
              alt={landImages[5].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export const HeroSection = ({ onSearch, searchFilters, setSearchFilters }) => {
  const [activeFilter, setActiveFilter] = useState('Todos');

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1500px_500px_at_50%_-150px,rgba(16,185,129,0.25),transparent)] dark:bg-[radial-gradient(1500px_500px_at_50%_-150px,rgba(16,185,129,0.2),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <motion.h1 
              initial={{ y: 10, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.6 }} 
              className="text-4xl md:text-5xl font-black leading-tight tracking-tight"
            >
              Encontrá el <span className="text-emerald-600 dark:text-emerald-400">terreno ideal</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 10, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.6, delay: 0.1 }} 
              className="mt-3 text-neutral-600 dark:text-neutral-300 max-w-xl"
            >
              Compará precios, superficies y servicios de miles de lotes de las mejores inmobiliarias. Todo en un mismo lugar.
            </motion.p>

            <motion.div
              initial={{ y: 10, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Tabs defaultValue="comprar" className="mt-6">
                <TabsContent value="comprar" className="mt-4">
                  <SearchCard onSearch={onSearch} searchFilters={searchFilters} setSearchFilters={setSearchFilters}/>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden md:block"
          >
            <ImageGallery />
          </motion.div>
        </div>
      </div>
    </section>
  );
}