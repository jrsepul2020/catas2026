import PropTypes from 'prop-types';

const categorias = [
  {
    titulo: "Vista",
    color: "bg-yellow-50 border-yellow-200",
    bgColor: "bg-yellow-50/30",
    items: [
      { key: "vista_limpidez", label: "Limpidez", valores: [5, 4, 3, 2, 1], mostrarTitulo: true },
      { key: "vista_color", label: "Color", valores: [10, 8, 6, 4, 2] },
    ]
  },
  {
    titulo: "Olfato / Olor",
    color: "bg-gray-50 border-gray-200",
    bgColor: "",
    items: [
      { key: "olfato_limpidez", label: "Limpidez", valores: [6, 5, 4, 3, 2], mostrarTitulo: true },
      { key: "olfato_intensidad", label: "Intens. Positiva", valores: [8, 7, 6, 4, 2] },
      { key: "olfato_calidad", label: "Calidad", valores: [16, 14, 12, 10, 8] },
    ]
  },
  {
    titulo: "Sabor",
    color: "bg-yellow-50 border-yellow-200",
    bgColor: "bg-yellow-50/30",
    items: [
      { key: "sabor_limpio", label: "Limpio", valores: [6, 5, 4, 3, 2], mostrarTitulo: true },
      { key: "sabor_intensidad", label: "Intensidad", valores: [8, 7, 6, 4, 2] },
      { key: "sabor_persistencia", label: "Persist. Armon.", valores: [8, 7, 6, 5, 4] },
      { key: "sabor_calidad", label: "Calidad", valores: [22, 19, 16, 13, 10] },
    ]
  },
  {
    titulo: "Juicio Global",
    color: "bg-gray-50 border-gray-200",
    bgColor: "",
    items: [
      { key: "juicio_global", label: "Global", valores: [11, 10, 9, 8, 7], mostrarTitulo: true },
    ]
  },
];

export default function CategoriasCata({ puntuaciones, setPuntuaciones }) {
  const handlePuntuacion = (key, valor) => {
    setPuntuaciones(prev => ({
      ...prev,
      [key]: prev[key] === valor ? 0 : valor
    }));
  };

  return (
    <div className="space-y-1.5">
      {categorias.map((categoria, idx) => (
        <div key={idx} className={`rounded-lg ${categoria.bgColor} p-1`}>
          <div className="space-y-1">
            {categoria.items.map((item) => (
              <div key={item.key} className="flex items-center justify-end gap-1.5">
                {/* Título de categoría inline en primera fila */}
                {item.mostrarTitulo && (
                  <div className="flex-shrink-0 mr-2">
                    <span className={`font-bold text-xs px-2 py-1 rounded border ${categoria.color}`}>
                      {categoria.titulo}
                    </span>
                  </div>
                )}
                
                {/* Label - alineado a la derecha */}
                {item.label && (
                  <div className="flex-1 text-right pr-2">
                    <span className="font-medium text-gray-700 text-xs">{item.label}</span>
                  </div>
                )}
                
                {/* Display actual - grande */}
                <div className="w-12 h-12 border-2 border-[#E8DEC9] rounded flex items-center justify-center bg-white font-bold text-lg flex-shrink-0">
                  {puntuaciones[item.key]}
                </div>
                
                {/* Botones de puntuación - grandes */}
                <div className="flex gap-1">
                  {item.valores.map((valor) => (
                    <button
                      key={valor}
                      onClick={() => handlePuntuacion(item.key, valor)}
                      className={`w-12 h-12 rounded font-bold text-base transition-all duration-200 flex-shrink-0 ${
                        puntuaciones[item.key] === valor
                          ? 'bg-[#BA4280] text-white shadow-md scale-105'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {valor}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

CategoriasCata.propTypes = {
  puntuaciones: PropTypes.object.isRequired,
  setPuntuaciones: PropTypes.func.isRequired
};