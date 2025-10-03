
import Menu from "../components/Menu";
import Login from '../components/Login';
import RegistroIndependiente from './RegistroIndependiente';
import { useState } from 'react';

const Servicios = ({ user }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    return (
        <div style={{ minHeight: '100vh', background: '#f6f8fa' }}>
            <Menu user={user} />
            <div style={{ display: 'flex', minHeight: '90vh', padding: '2rem' }}>
                <div style={{ 
                    flex: '0 0 400px',
                    background: '#fff',
                    padding: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '16px',
                    height: 'fit-content',
                    margin: 'auto'
                }}>
                    <h2 style={{ 
                        color: '#1a2238',
                        marginBottom: '1.5rem',
                        fontWeight: 700,
                        textAlign: 'center'
                    }}>
                        Bienvenido a Mafiest
                    </h2>
                    <p style={{ 
                        color: '#444',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        Clases pregrabadas de matemáticas para todos los niveles
                    </p>

                    <div style={{ marginBottom: '2rem' }}>
                        {activeTab === 'login' ? (
                            <Login
                                handleLogin={() => {}}
                                username={username}
                                setUsername={setUsername}
                                password={password}
                                setPassword={setPassword}
                                message={message}
                            />
                        ) : (
                            <RegistroIndependiente 
                                onSuccess={() => {
                                    setMessage({
                                        type: 'success',
                                        text: '¡Registro exitoso! Ahora puedes iniciar sesión.'
                                    });
                                    // Cambiamos a la pestaña de login después de un pequeño retraso
                                    setTimeout(() => {
                                        setActiveTab('login');
                                    }, 1500);
                                }}
                            />
                        )}
                    </div>

                    <div>
                        {activeTab === 'login' ? (
                            <p style={{ 
                                textAlign: 'center',
                                color: '#666'
                            }}>
                                ¿Eres independiente?{' '}
                                <button
                                    onClick={() => setActiveTab('registro')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#e94560',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = 'rgba(233, 69, 96, 0.1)'}
                                    onMouseOut={(e) => e.target.style.background = 'none'}
                                >
                                    Regístrate aquí
                                </button>
                            </p>
                        ) : (
                            <p style={{ 
                                textAlign: 'center',
                                color: '#666'
                            }}>
                                ¿Ya tienes cuenta?{' '}
                                <button
                                    onClick={() => setActiveTab('login')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#e94560',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = 'rgba(233, 69, 96, 0.1)'}
                                    onMouseOut={(e) => e.target.style.background = 'none'}
                                >
                                    Inicia sesión
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                <div style={{ 
                    flex: 1,
                    padding: '3rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <h1 style={{ 
                        color: '#e94560',
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        Aprende matemáticas a tu ritmo
                    </h1>
                    <ul style={{ 
                        fontSize: '1.2rem',
                        color: '#222',
                        lineHeight: 1.7,
                        marginBottom: '2rem',
                        listStyleType: 'none',
                        padding: 0
                    }}>
                        <li style={{ marginBottom: '0.5rem' }}>✓ Acceso a clases pregrabadas de matemáticas</li>
                        <li style={{ marginBottom: '0.5rem' }}>✓ Material didáctico y ejercicios interactivos</li>
                        <li style={{ marginBottom: '0.5rem' }}>✓ Avanza a tu propio ritmo, sin horarios</li>
                        <li style={{ marginBottom: '0.5rem' }}>✓ Soporte y asesorías para dudas</li>
                    </ul>
                    <div style={{ 
                        color: '#1a2238',
                        fontWeight: 500,
                        textAlign: 'center',
                        fontSize: '1.1rem'
                    }}>
                        <p>¡Únete a la comunidad Mafiest y potencia tu aprendizaje!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Servicios;
