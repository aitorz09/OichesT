import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import useSala from '../hooks/useSala.jsx';
import StarRating from './StartRating.jsx';
import Header from './Header.jsx';
import DefaultProfile from '/DefaultProfile2.png';
import Noimage from '../../src/assets/noimage.png';
import useAuth from '../hooks/useAuth.jsx';
import Footer from './Footer.jsx';

const SalaDetail = () => {
    const { VITE_API_URL_BASE } = import.meta.env;
    const { idSala } = useParams();
    const { entry, error } = useSala(idSala);
    const { currentUser } = useAuth();

    const {
        nombre,
        provincia,
        equipamiento,
        descripcion,
        condiciones,
        genero,
        direccion,
        capacidad,
        usuarioAvatar,
        comentarios,
        email,
        precios,
        photos,
    } = entry;

    return entry ? (
        <>
            <Header txt={nombre} />

            <main className="p-4 mt-6 flex flex-col gap-6 mx-auto shadow-xl w-11/12 md:max-w-1200 md:px-24">
                <section className="flex flex-col mx-auto md:flex-row items-center gap-6">
                    <img
                        className="w-40 h-40 rounded-full object-cover"
                        src={
                            usuarioAvatar
                                ? `${VITE_API_URL_BASE}/uploads/${usuarioAvatar}`
                                : DefaultProfile
                        }
                        alt="Imagen de perfil de la sala"
                    />
                </section>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                    {genero && (
                        <span>
                            <span className="text-lg font-semibold">
                                Géneros
                            </span>
                            {genero.map((gen) => (
                                <div key={gen.generoId} className="text-black">
                                    {gen.generoName}
                                </div>
                            ))}
                        </span>
                    )}
                    {capacidad && (
                        <span>
                            <span className="text-lg font-semibold">Aforo</span>{' '}
                            <p className="text-black">{capacidad}</p>
                        </span>
                    )}
                    {precios && (
                        <span>
                            <span className="text-lg font-semibold">
                                Precio
                            </span>{' '}
                            <p className="text-black">{precios}€</p>
                        </span>
                    )}
                    {direccion && (
                        <span>
                            <span className="text-lg font-semibold">
                                Dirección
                            </span>{' '}
                            <p className="text-black">{direccion}</p>
                        </span>
                    )}
                    {provincia && (
                        <span>
                            <span className="text-lg font-semibold">
                                Provincia
                            </span>{' '}
                            <p className="text-black">{provincia}</p>
                        </span>
                    )}
                    {currentUser && (
                        <span>
                            <span className="text-lg font-semibold">
                                Contacto
                            </span>{' '}
                            <p className="text-black">{email}</p>
                        </span>
                    )}
                    {equipamiento && (
                        <span className="md:col-start-1 md:col-end-4">
                            <span className="text-lg font-semibold">
                                Equipamiento
                            </span>{' '}
                            <p className="text-black">{equipamiento}</p>
                        </span>
                    )}

                    {condiciones && (
                        <span className="md:col-start-1 md:col-end-4">
                            <span className="text-lg font-semibold">
                                Condiciones
                            </span>{' '}
                            <p className="text-black">{condiciones}</p>
                        </span>
                    )}
                </section>
                <section>
                    <h3 className="text-lg font-semibold">Descripción </h3>
                    <p className="mb-6 mt-3">
                        {descripcion
                            ? descripcion
                            : 'La Sala tiene que añadir la descripción.'}
                    </p>
                </section>

                <section>
                    <h3 className="text-lg font-semibold">Fotos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 place-items-center">
                        {photos.length > 0 ? (
                            <>
                                {photos.map((photo) => (
                                    <img
                                        key={photo.id}
                                        src={`${VITE_API_URL_BASE}/uploads/${photo.name}`}
                                        className="rounded-3xl max-h-80 shadow-xl"
                                        alt="Foto de la sala"
                                    />
                                ))}
                            </>
                        ) : (
                            <>
                                <img
                                    className="col-span-1 md:col-span-2 rounded-3xl"
                                    src={Noimage}
                                    alt="No image"
                                />
                            </>
                        )}
                    </div>
                </section>
                {comentarios.length > 0 && (
                    <section>
                        <h3 className="text-lg font-semibold">Comentarios</h3>
                        {comentarios.map((comentario) => (
                            <div
                                key={comentario.id}
                                className="my-6 border p-3 rounded-3xl flex flex-col w-fit justify-between"
                            >
                                <span>
                                    {comentario.comentario}
                                    <p className="text-black">
                                        {comentario.createdAt.slice(0, 10)}
                                    </p>
                                </span>
                                <Link
                                    className="flex place-items-center gap-2 hover:scale-105 transition-all"
                                    to={`/grupo/${comentario.grupoVotaId}`}
                                >
                                    <div>
                                        <StarRating rating={comentario.voto} />
                                    </div>
                                    <img
                                        className="w-10"
                                        src={
                                            comentario.grupoAvatar
                                                ? comentario.grupoAvatar
                                                : DefaultProfile
                                        }
                                        alt=""
                                    />
                                    <p>{comentario.grupoVotaName}</p>
                                </Link>
                            </div>
                        ))}
                    </section>
                )}
                <section>
                    <div className="flex justify-around mt-8 mb-12">
                        <Link
                            to={`/sala/${idSala}/reservas`}
                            className="p-4 shadow-lg rounded bg-purple-600 text-white hover:scale-105 transition-all"
                        >
                            Reservar
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    ) : (
        <p>{error}</p>
    );
};

export default SalaDetail;
