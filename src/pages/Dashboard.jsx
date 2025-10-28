import { useState, useEffect } from "react";
import { supabaseServices } from "@/api/supabaseClient";
import { motion } from "framer-motion";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatCard from "../components/dashboard/StatCard";
import QuickActions from "../components/dashboard/QuickActions";
import TestSupabase from "../components/TestSupabase";
import { Users, Activity, TrendingUp, Clock } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseServices.auth.me()
      .then((userData) => {
        setUser(userData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333951]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WelcomeCard greeting={getGreeting()} userName={user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || "Catador"} />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mt-4 md:mt-6 lg:mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatCard
            title="Usuarios Activos"
            value="1,234"
            icon={Users}
            trend="+12%"
            trendUp={true}
            color="gold"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatCard
            title="Actividad"
            value="856"
            icon={Activity}
            trend="+8%"
            trendUp={true}
            color="gold"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StatCard
            title="Crecimiento"
            value="23.5%"
            icon={TrendingUp}
            trend="+5%"
            trendUp={true}
            color="gold"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StatCard
            title="Tiempo Promedio"
            value="4.2h"
            icon={Clock}
            trend="-3%"
            trendUp={false}
            color="gold"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-4 md:mt-6 lg:mt-8"
      >
        <QuickActions />
      </motion.div>

      {/* Componente temporal de prueba */}
      <TestSupabase />
    </div>
  );
}