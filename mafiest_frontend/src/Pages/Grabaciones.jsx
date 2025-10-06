import { useEffect, useState } from 'react'
import * as grabacionesService from '../services/grabaciones'
import AgregarGrabacion from '../components/AgregarGrabacion'

const Grabaciones = ({ user }) => {
	const [grabaciones, setGrabaciones] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const cargarGrabaciones = async () => {
		try {
			setLoading(true)
			const data = await grabacionesService.getAll()
			setGrabaciones(data)
			setError(null)
		} catch (err) {
			setError('No se pudieron cargar las grabaciones')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		cargarGrabaciones()
	}, [])

	return (
		<div style={{ padding: 24 }}>
			<h2>Grabaciones</h2>
			{(user.rol === 'docente' || user.rol === 'administrador') && (
				<AgregarGrabacion user={user} onGrabacionAgregada={cargarGrabaciones} />
			)}
			{loading ? (
				<div>Cargando...</div>
			) : error ? (
				<div style={{ color: 'red' }}>{error}</div>
			) : (
				<ul>
					{grabaciones.map(g => (
						<li key={g.id}>
							<a href={g.driveLink} target="_blank" rel="noopener noreferrer">{g.title}</a> - {g.description}
							{g.grupoId ? ` (Grupo ${g.grupoId})` : ' (General)'}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default Grabaciones

