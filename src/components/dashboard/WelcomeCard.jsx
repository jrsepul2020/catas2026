import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function WelcomeCard({ greeting, userName }) {
  return (
    <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-[#333951] via-[#3d4463] to-[#4a5576]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>
      
      <div className="relative p-8 md:p-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">{greeting}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {userName ? `¡Hola, ${userName.split(' ')[0]}!` : '¡Bienvenido!'}
            </h1>
            <p className="text-white/90 text-lg">
              Aquí está tu resumen del día
            </p>
          </div>
          
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <div className="text-4xl">👋</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}