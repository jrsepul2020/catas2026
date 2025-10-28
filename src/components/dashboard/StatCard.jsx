import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import PropTypes from 'prop-types';

const colorVariants = {
  gold: {
    bg: "bg-[#333951]/10",
    icon: "bg-[#333951]",
    text: "text-[#333951]",
    gradient: "from-[#333951] to-[#4a5576]"
  }
};

export default function StatCard({ title, value, icon: Icon, trend, trendUp, color = "gold" }) {
  const colors = colorVariants[color];
  
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className={`p-2 md:p-3 rounded-xl ${colors.bg}`}>
            <Icon className={`w-5 h-5 md:w-6 md:h-6 text-white ${colors.icon}`} />
          </div>
          <div className={`flex items-center gap-1 text-xs md:text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />}
            {trend}
          </div>
        </div>
        
          <div>
          <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-[#333951]">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  trend: PropTypes.string,
  trendUp: PropTypes.bool,
  color: PropTypes.string
};