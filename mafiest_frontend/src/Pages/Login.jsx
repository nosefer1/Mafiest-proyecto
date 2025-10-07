
import '../styles/login.css';
import { useState } from 'react';
import loginService from '../services/login';
import { setToken as setActividadesToken } from '../services/actividades';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState(null);
	const [loading, setLoading] = useState(false);

	const inputStyle = {
		width: '100%',
		padding: '12px',
		marginBottom: '12px',
		border: '1px solid #e0e0e0',
		borderRadius: '8px',
		fontSize: '16px',
		transition: 'border-color 0.2s',
		outline: 'none',
	};

	const buttonStyle = {
		width: '100%',
		padding: '12px',
		background: '#e94560',
		color: '#fff',
		border: 'none',
		borderRadius: '8px',
		fontSize: '16px',
		fontWeight: '700',
		cursor: 'pointer',
		transition: 'background 0.2s',
		marginTop: '8px',
	}

	const titleStyle = {
		color: '#1a2238',
		fontSize: '1.5rem',
		fontWeight: '700',
		marginBottom: '1.5rem',
		textAlign: 'center',
	}

	const messageStyle = {
		padding: '12px',
		borderRadius: '8px',
		marginBottom: '16px',
		fontSize: '14px',
		textAlign: 'center',
	}

			const handleLogin = async (event) => {
				event.preventDefault();
				setLoading(true);
				setMessage(null);

				try {
					const user = await loginService.login({ username, password });
					setActividadesToken(user.token);
					setMessage({ type: true, message: '¡Login exitoso!' });
					setUsername('');
					setPassword('');
					// Aquí podrías redirigir o actualizar el estado global si lo necesitas
				} catch (error) {
					setMessage({ type: false, message: 'Usuario o contraseña incorrectos.' });
				} finally {
					setLoading(false);
				}
			};

			return (
				<div style={{ padding: '1rem 0' }}>
					<h2 style={titleStyle}>Iniciar Sesión</h2>
					{message && (
						<div style={{
							...messageStyle,
							background: message.type ? '#f0fdf4' : '#fef2f2',
							color: message.type ? '#166534' : '#991b1b',
							border: `1px solid ${message.type ? '#bbf7d0' : '#fecaca'}`,
						}}>
							{message.message}
						</div>
					)}
					<form onSubmit={handleLogin}>
						<div>
								<input
									type="text"
									value={username}
									name="Username"
									placeholder="Usuario"
									onChange={({ target }) => setUsername(target.value)}
									disabled={loading}
									style={inputStyle}
								/>
							</div>
							<div>
								<input
									type="password"
									value={password}
									name="Password"
									placeholder="Contraseña"
									onChange={({ target }) => setPassword(target.value)}
									disabled={loading}
									style={inputStyle}
								/>
							</div>
							<button type="submit" disabled={loading} style={{
								...buttonStyle,
								opacity: loading ? 0.7 : 1,
								cursor: loading ? 'not-allowed' : 'pointer',
							}}>
								{loading ? 'Cargando...' : 'Iniciar Sesión'}
							</button>
						</form>
					</div>
				);
			}

export default Login
