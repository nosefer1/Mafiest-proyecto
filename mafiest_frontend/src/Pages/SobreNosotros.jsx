import Menu from "../components/Menu";
import '../styles/sobrenosotros.css';
const SobreNosotros = () => (
  <div style={{ minHeight: '100vh', background: '#f6f8fa' }}>
    <Menu />
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2em', color: '#e94560', fontWeight: 800, fontSize: '2.2rem', letterSpacing: 1 }}>Sobre Nosotros</h1>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: '2.5rem 2rem' }}>
        <p style={{ color: '#222', fontSize: '1.15em', marginBottom: '1.5em', lineHeight: 1.7 }}>
          Bienvenidos a Mafiest, un espacio donde los niños y jóvenes descubren cómo las matemáticas pueden transformar su futuro.
        </p>
        <div style={{ margin: '2em 0' }}>
          <p style={{ color: '#222', fontSize: '1.1em', marginBottom: '1em' }}>Nos enfocamos en que cada estudiante logre mejorar grandes habilidades, como pueden ser:</p>
          <ul style={{ listStyleType: 'disc', marginLeft: '2em', marginTop: '1em', color: '#222' }}>
            <li style={{ marginBottom: '0.5em' }}>El pensamiento lógico</li>
            <li style={{ marginBottom: '0.5em' }}>Una mayor perseverancia</li>
            <li style={{ marginBottom: '0.5em' }}>Un mejor manejo en la tecnología</li>
          </ul>
        </div>
        <p style={{ color: '#222', fontSize: '1.1em', marginBottom: '1.5em', lineHeight: 1.7 }}>
          Con nuestro acompañamiento, los niños podrán crear sus propios proyectos y descubrir lo emocionante que es aprender y aplicar matemáticas.
        </p>
        <p style={{ color: '#222', fontSize: '1.1em', marginBottom: 0, lineHeight: 1.7 }}>
          ¡Queremos que se sientan motivados y seguros para enfrentar los retos del mundo digital!
        </p>
      </div>
    </div>
  </div>
);

export default SobreNosotros;