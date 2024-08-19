import { useContext } from 'react';
import { AuthContext } from '../context/auth/auth.context';
import { NavLink } from 'react-router-dom';

const Menu = () => {
    const { currentUser, signOut } = useContext(AuthContext);

    return (
        <>
            <NavLink
                to="/salas"
                className="max-md:my-8 font-medium hover:text-purpleOiches"
            >
                Salas
            </NavLink>
            <NavLink
                to="/grupos" // Enlace corregido
                className="max-md:my-8 font-medium hover:text-purpleOiches active:text-purpleOiches"
            >
                Músicos
            </NavLink>
            {/* <NavLink
                to="/sobre-nosotros" // Asegúrate de que la ruta sea correcta
                className="max-md:my-8 font-medium hover:text-purpleOiches active:text-purpleOiches"
            >
                Sobre nosotros
            </NavLink> */}
            {!currentUser ? (
                <>
                    <NavLink
                        to="/login"
                        className="max-md:my-8 font-medium text-purpleOiches hover:text-black"
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/register"
                        className="btn-account max-md:my-8 font-medium"
                    >
                        Registro
                    </NavLink>
                </>
            ) : (
                <>
                    <NavLink
                        to="/login"
                        onClick={() => {
                            signOut();
                        }}
                        className="max-md:my-8 font-medium text-purpleOiches hover:text-black"
                    >
                        Logout
                    </NavLink>
                    <NavLink
                        to="/users"
                        className="btn-account max-md:my-8 font-medium"
                    >
                        Mi perfil
                    </NavLink>
                </>
            )}
        </>
    );
};

export default Menu;
