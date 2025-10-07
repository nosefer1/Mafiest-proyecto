import { Routes, Route } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import Contactanos from "../Pages/Contactanos";
import SobreNosotros from "../Pages/SobreNosotros";
import Actividades from "../Pages/Actividades";
import VerActividades from "../Pages/VerActividades";
import VerContactos from "../Pages/VerContactos";
import Asesorias from "../Pages/Asesorias";
import Login from "../Pages/Login";
import RegistroIndependiente from "../Pages/RegistroIndependiente";
import Grabaciones from "../Pages/Grabaciones";
import VerGrabaciones from "../Pages/VerGrabaciones";
import VerAsesorias from "../Pages/VerAsesorias";
import ResponderAsesorias from "../Pages/ResponderAsesorias";
import Biblioteca from "../Pages/Biblioteca";
import GestionarUsuarios from "../Pages/GestionarUsuarios";
import Perfil from "../Pages/Perfil";

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
        <Route path="/veractividades" element={<VerActividades user={user} />} />
        <Route path="/gestionarusuarios" element={
          user?.rol === 'administrador' ? <GestionarUsuarios user={user} /> : <LandingPage user={user} />
        } />
        <Route path="/perfil" element={<Perfil user={user} setUser={setUser} />} />
        <Route path="/contactanos" element={<Contactanos user={user} />} />
        <Route path="/vercontactos" element={
          user?.rol === 'administrador' ? <VerContactos user={user} /> : <LandingPage user={user} />
        } />
        <Route path="/asesorias" element={<Asesorias user={user} />} />
        <Route path="/verasesorias" element={<VerAsesorias user={user} />} />
        <Route path="/responderasesorias" element={
          user?.rol === 'administrador' ? <ResponderAsesorias user={user} /> : <LandingPage user={user} />
        } />
        <Route path="/grabaciones" element={
          user?.rol === 'docente' || user?.rol === 'administrador'
            ? <Grabaciones user={user} />
            : <LandingPage user={user} />
        } />
        <Route path="/vergrabaciones" element={<VerGrabaciones user={user} />} />
        {/* Biblioteca: accesible para todos los usuarios */}
        <Route path="/biblioteca" element={<Biblioteca user={user} />} />
  <Route path="*" element={<LandingPage user={user} />} />
      </Routes>
  );
};

export default AppRoutes;
