import { useState, useEffect, useCallback } from 'react';

/**
 * Slider de imágenes con navegación por flechas y dots.
 *
 * Props:
 * - imagenes: string[] - Array de URLs de imágenes
 * - alt: string - Texto alternativo para accesibilidad
 *
 * Comportamiento:
 * - Si hay una sola imagen, la muestra estática (sin controles).
 * - Soporta swipe en móviles.
 */
function ImageSlider({ imagenes = [], alt = '' }) {
  const [indiceActual, setIndiceActual] = useState(0);

  // Reset al índice 0 si cambian las imágenes
  useEffect(() => {
    setIndiceActual(0);
  }, [imagenes]);

  const total = imagenes.length;

  const siguiente = useCallback(() => {
    setIndiceActual(prev => (prev + 1) % total);
  }, [total]);

  const anterior = useCallback(() => {
    setIndiceActual(prev => (prev - 1 + total) % total);
  }, [total]);

  const irA = useCallback((indice) => {
    setIndiceActual(indice);
  }, []);

  // Soporte para swipe en móviles
  useEffect(() => {
    let inicioX = 0;
    let finX = 0;

    const handleTouchStart = (e) => {
      inicioX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      finX = e.changedTouches[0].clientX;
      const diff = inicioX - finX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) siguiente();
        else anterior();
      }
    };

    const container = document.querySelector('.image-slider-container');
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [siguiente, anterior]);

  // Solo una imagen o vacío: mostrar placeholder
  if (total <= 0) {
    return (
      <div className="image-slider-container single">
        <div style={{
          width: '100%',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#E0EFFE',
          borderRadius: '12px',
          color: '#64748B',
          fontSize: '14px'
        }}>
          Sin imagen disponible
        </div>
      </div>
    );
  }

  if (total === 1) {
    return (
      <div className="image-slider-container single">
        <img src={imagenes[0]} alt={alt} className="slider-image" />
      </div>
    );
  }

  return (
    <div className="image-slider-container">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${indiceActual * 100}%)` }}
      >
        {imagenes.map((img, i) => (
          <img key={i} src={img} alt={`${alt} ${i + 1}`} className="slider-image" />
        ))}
      </div>

      {/* Flecha izquierda */}
      <button
        type="button"
        className="slider-btn slider-btn-left"
        onClick={anterior}
        aria-label="Imagen anterior"
      >
        ←
      </button>

      {/* Flecha derecha */}
      <button
        type="button"
        className="slider-btn slider-btn-right"
        onClick={siguiente}
        aria-label="Siguiente imagen"
      >
        →
      </button>

      {/* Dots de navegación */}
      <div className="slider-dots">
        {imagenes.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`slider-dot ${i === indiceActual ? 'active' : ''}`}
            onClick={() => irA(i)}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>

      {/* Contador */}
      <div className="slider-counter">
        {indiceActual + 1} / {total}
      </div>
    </div>
  );
}

export default ImageSlider;
