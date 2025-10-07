import React from 'react';

import Menu from '../components/Menu';
import '../styles/biblioteca.css';

const Biblioteca = () => {
  const libros = [
    {
      id: 1,
      titulo: 'Álgebra de Rubinio',
      imagen: '/algebra_rubinios.jpeg',
      descripcion: 'Libro de álgebra fundamental'
    },
    {
      id: 2,
      titulo: 'Geometría Analítica Lehmann',
      imagen: '/Geometría_analitica_lehmann.jpeg',
      descripcion: 'Manual completo de geometría analítica'
    },
    {
      id: 3,
      titulo: 'Matemáticas Simplificadas',
      imagen: '/mates_simplificadas.jpg',
      descripcion: 'Guía práctica de matemáticas'
    }
  ];

  const driveLink = 'https://drive.google.com/drive/folders/1VGq9QVr1xbdxmtdnmKt9nMdKHJTbvslp';

  return (
    <>
      <Menu />
      <div className="biblioteca-container">
        <h1 className="biblioteca-title">Biblioteca Digital</h1>
        
        <div className="libros-grid">
          {libros.map((libro) => (
            <div key={libro.id} className="libro-card">
              <img 
                src={libro.imagen} 
                alt={libro.titulo}
                className="libro-image"
              />
              <div className="libro-info">
                <h3 className="libro-title">{libro.titulo}</h3>
                <p>{libro.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        <a 
          href={driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="drive-button"
        >
          Acceder a la Biblioteca Completa en Drive
        </a>
      </div>
    </>
  );
};

export default Biblioteca;