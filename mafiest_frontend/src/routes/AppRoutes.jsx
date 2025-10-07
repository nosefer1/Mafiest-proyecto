import { Routes, Route } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import Contactanos from "../Pages/Contactanos";
import SobreNosotros from "../Pages/SobreNosotros";
import Crear from "../Pages/Crear-usuarios";
import Actividades from "../Pages/Actividades";
import VerActividades from "../Pages/Ver-Actividades";
import VerContactos from "../Pages/Ver-Contactos";
import Asesorias from "../Pages/Asesorias";
import Login from "../Pages/Login";
import RegistroIndependiente from "../Pages/RegistroIndependiente";
import Grabaciones from "../Pages/Grabaciones";
import VerGrabaciones from "../Pages/Ver-Grabaciones";
import VerAsesorias from "../Pages/Ver-Asesorias";
import ResponderAsesorias from "../Pages/ResponderAsesorias";

const AppRoutes = ({ user, setUser }) => {
  return (
    <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/registro" element={<RegistroIndependiente />} />
        <Route path="/sobrenosotros" element={<SobreNosotros user={user} />} />
        {/* Actividades: docentes y administradores pueden crear, todos pueden ver */}
        <Route path="/actividades" element={
          user?.rol === 'docente' || user?.rol === 'administrador'
            ? <Actividades user={user} />
            : <LandingPage user={user} />
        } />
        <Route path="/ver-actividades" element={<VerActividades user={user} />} />
        {/* Crear usuario solo admin */}
        <Route path="/crear-usuario" element={
          user?.rol === 'administrador' ? <Crear user={user} /> : <LandingPage user={user} />
        } />
        <Route path="/contactanos" element={<Contactanos user={user} />} />
        <Route path="/ver-contactos" element={
          user?.rol === 'administrador' ? <VerContactos user={user} /> : <LandingPage user={user} />
        } />
        <Route path="/asesorias" element={<Asesorias user={user} />} />
        <Route path="/ver-asesorias" element={<VerAsesorias user={user} />} />
        <Route path="/responder-asesorias" element={
          user?.rol === 'administrador' ? <ResponderAsesorias user={user} /> : <LandingPage user={user} />
        } />
        {/* Grabaciones: docentes y admin pueden agregar, todos pueden ver */}
        <Route path="/grabaciones" element={
          user?.rol === 'docente' || user?.rol === 'administrador'
            ? <Grabaciones user={user} />
            : <LandingPage user={user} />
        } />
        <Route path="/ver-grabaciones" element={<VerGrabaciones user={user} />} />
  <Route path="*" element={<LandingPage user={user} />} />
      </Routes>
  );
};

export default AppRoutes;
