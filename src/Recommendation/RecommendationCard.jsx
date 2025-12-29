import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MapPin, Info } from "lucide-react";

export const RecommendationCard = ({ recommendation }) => {
  const {
    titulo,
    razon,
    puntaje,
    compatibilidad,
    id_terreno
  } = recommendation;

  const colorByCompat = {
    Alta: "bg-green-100 text-green-700",
    Media: "bg-yellow-100 text-yellow-700",
    Baja: "bg-red-100 text-red-700",
  };

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{titulo}</h3>
            <Badge className={`${colorByCompat[compatibilidad] || "bg-gray-100 text-gray-700"} mt-1`}>
              Compatibilidad: {compatibilidad}
            </Badge>
          </div>
          <span className="text-sm text-gray-500">#{id_terreno}</span>
        </div>

        <div className="mt-3">
          <p className="text-gray-600 text-sm leading-relaxed">{razon}</p>
        </div>

        <div className="mt-4">
          <div className="flex justify-between mb-1 text-sm text-gray-600">
            <span>Puntaje IA</span>
            <span>{puntaje}%</span>
          </div>
          <Progress value={puntaje} className="h-2 rounded-full" />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="outline">
            <MapPin className="w-4 h-4 mr-1" /> Ver en mapa
          </Button>
          <Button size="sm" variant="default">
            <Info className="w-4 h-4 mr-1" /> Detalle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
