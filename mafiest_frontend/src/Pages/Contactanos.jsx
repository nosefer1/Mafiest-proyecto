import { useState } from 'react'
import Menu from "../components/Menu"
import Notification from '../components/Notification'

const Contactanos = ({ user }) => {
  const [message, setMessage] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Aquí iría la lógica para enviar el formulario
      setMessage({
        type: 'success',
        text: '¡Mensaje enviado correctamente!'
      })
      // Limpiar el formulario después de enviar
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
      })
    }
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <div style={{ 
        minHeight: '100vh', 
        background: '#e94560',
        backgroundImage: 'linear-gradient(135deg, #e94560 0%, #c81d3e 100%)'
      }}>
      <Menu user={user} />
      <div style={{ 
        maxWidth: 800, 
        margin: '0 auto', 
        padding: '32px 20px',
        position: 'relative'
      }}>
        {message && <Notification type={message.type} message={message.text} />}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#fff'
        }}>
          <h1 style={{ 
            fontWeight: 800, 
            fontSize: '3rem',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Contáctanos
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9
          }}>
            Estamos aquí para ayudarte. ¡Envíanos tu mensaje!
          </p>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          padding: '2.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1a2238',
                fontWeight: '500'
              }}>
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '8px'
                }}
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1a2238',
                fontWeight: '500'
              }}>
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '8px'
                }}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1a2238',
                fontWeight: '500'
              }}>
                Asunto
              </label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '8px'
                }}
                placeholder="¿Sobre qué nos quieres contactar?"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1a2238',
                fontWeight: '500'
              }}>
                Mensaje
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '8px',
                  minHeight: '150px',
                  resize: 'vertical'
                }}
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#e94560',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contactanos