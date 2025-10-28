import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, FileText, Settings, BarChart } from "lucide-react";

const actions = [
  {
    title: "Nuevo Proyecto",
    description: "Crear un nuevo proyecto",
    icon: Plus,
  },
  {
    title: "Generar Reporte",
    description: "Crear reporte mensual",
    icon: FileText,
  },
  {
    title: "Configuración",
    description: "Ajustar preferencias",
    icon: Settings,
  },
  {
    title: "Análisis",
    description: "Ver estadísticas",
    icon: BarChart,
  }
];

export default function QuickActions() {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="border-b border-slate-100 p-3 md:p-6">
        <CardTitle className="text-base md:text-xl font-bold text-[#958154]">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              className="p-4 md:p-6 border-2 border-slate-100 rounded-xl transition-all duration-300 text-left hover:bg-[#E8DEC9] hover:border-[#958154]/30"
            >
              <div className="flex flex-col items-start gap-2 md:gap-3">
                <div className="p-2 md:p-3 rounded-xl bg-[#E8DEC9]">
                  <action.icon className="w-5 h-5 md:w-6 md:h-6 text-[#958154]" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-sm md:text-base">{action.title}</h3>
                  <p className="text-xs md:text-sm text-slate-600">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}