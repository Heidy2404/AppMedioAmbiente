import { useEffect, useState } from "react";

const slides = [
  {
    title: "🌍 Protegemos Nuestro Planeta",
    text: "Trabajamos juntos por un futuro sostenible para República Dominicana",
    bg: "from-green-600 to-blue-600",
  },
  {
    title: "🌱 Conservación y Biodiversidad",
    text: "Preservamos nuestros ecosistemas únicos y especies nativas",
    bg: "from-blue-600 to-green-600",
  },
  {
    title: "♻️ Educación Ambiental",
    text: "Promovemos la conciencia ecológica en toda la población",
    bg: "from-green-600 to-teal-600",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`min-w-full h-64 flex items-center justify-center text-white bg-gradient-to-r ${slide.bg}`}
          >
            <div className="text-center px-4">
              <h2 className="text-3xl font-bold mb-3">{slide.title}</h2>
              <p className="text-lg">{slide.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botones de control */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-opacity ${
              current === i ? "bg-white opacity-100" : "bg-white opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
