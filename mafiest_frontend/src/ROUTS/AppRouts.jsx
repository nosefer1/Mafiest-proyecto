import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Servicios from "../Pages/Servicios";
import Contactanos from "../Pages/Contactanos";
import SobreNosotros from "../Pages/SobreNosotros";
import Crear from "../Pages/Crear-usuarios";
import Actividades from "../Pages/Actividades";
import VerActividades from "../Pages/Ver-Actividades";
import VerContacts from "../Pages/ver-contacts";

const AppRoutes = ({ user, setUser }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Servicios user={user} />} />
        <Route path="/sobrenosotros" element={<SobreNosotros user={user} />} />
        <Route path="/actividades" element={<Actividades user={user} />} />
        <Route path="/ver-actividades" element={
          user?.rol === 'administrador' ? <VerActividades user={user} /> : <Servicios user={user} />
        } />
        <Route path="/crear-usuario" element={
          user?.rol === 'administrador' ? <Crear user={user} /> : <Servicios user={user} />
        } />
        <Route path="/contactanos" element={<Contactanos user={user} />} />
        <Route path="/ver-contactos" element={
          user?.rol === 'administrador' ? <VerContacts user={user} /> : <Servicios user={user} />
        } />
        <Route path="*" element={<Servicios user={user} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
