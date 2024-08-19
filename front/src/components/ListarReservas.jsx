import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import GrupoVotaSala from './GrupoVotaSala';
import SalaVotaGrupo from './SalaVotaGrupo';

export const ListarReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [id, setId] = useState('');
    const [type, setType] = useState(''); // Either 'grupo' or 'sala'
    const { VITE_API_URL_BASE } = import.meta.env;
    const { token, currentUser, userLogged } = useAuth();

    const handleDelete = async (reservaId) => {
        try {
            const endpoint =
                type === 'grupo'
                    ? `${VITE_API_URL_BASE}/cancelar-reserva/${reservaId}`
                    : `${VITE_API_URL_BASE}/borrar-reserva/${reservaId}`;

            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    authorization: token,
                },
            });

            if (!response.ok) {
                toast.error('Fallo al eliminar la reserva');
                throw new Error('Fallo al eliminar la reserva');
            }

            setReservas(reservas.filter((reserva) => reserva.id !== reservaId));
            toast.success('Su reserva se ha eliminado con exito');
        } catch (error) {
            toast.error(error);
            console.error('Fallo al eliminar la reserva:', error);
        }
    };

    const handleConfirm = async (reservaId) => {
        if (currentUser) {
            try {
                const response = await fetch(
                    `${VITE_API_URL_BASE}/aprobar-reserva/${reservaId}`,
                    {
                        method: 'PUT',
                        headers: {
                            authorization: token,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to confirm reserva');
                }

                setReservas(
                    reservas.map((reserva) =>
                        reserva.id === reservaId
                            ? { ...reserva, confirmada: 1 }
                            : reserva
                    )
                );
                toast.success('Su reserva se ha confirmado con exito');
            } catch (error) {
                toast.error(error);
                console.error('Error confirming reserva:', error);
            }
        }
    };

    useEffect(() => {
        // FIXME
        const fetchData = async () => {
            if (currentUser) {
                try {
                    // Fetch Salas
                    const salasResponse = await fetch(
                        `${VITE_API_URL_BASE}/salas?pageSize=*`,
                        {
                            headers: {
                                authorization: token,
                            },
                        }
                    );

                    if (!salasResponse.ok) {
                        throw new Error('Failed to fetch salas');
                    }

                    const { rows } = await salasResponse.json();

                    const userSala = rows.find(
                        (sala) => sala.usuario_id === currentUser.id
                    );
                    if (userSala) {
                        setId(userSala.id);
                        setType('sala');
                        return;
                    }

                    // Fetch Grupos if no sala found
                    const gruposResponse = await fetch(
                        `${VITE_API_URL_BASE}/grupos?pageSize=*`,
                        {
                            headers: {
                                authorization: token,
                            },
                        }
                    );

                    if (!gruposResponse.ok) {
                        throw new Error('Failed to fetch grupos');
                    }

                    const groupRows = await gruposResponse.json();

                    if (groupRows) {
                        setId(userLogged.grupos[0].id);
                        setType('grupo');
                    }
                } catch (error) {
                    toast.error(error);
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [token, VITE_API_URL_BASE, currentUser]);

    useEffect(() => {
        const fetchReservas = async () => {
            if (id && type) {
                try {
                    const response = await fetch(
                        `${VITE_API_URL_BASE}/reservas/${type}s/${id}`,
                        {
                            headers: {
                                authorization: token,
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error(
                            `No se encontraron reservas para ${type}`
                        );
                    }
                    const reservasData = await response.json();

                    setReservas(reservasData.reservas);
                } catch (error) {
                    console.error('Error fetching reservas:', error);
                }
            }
        };

        fetchReservas();
    }, [token, VITE_API_URL_BASE, id, type]);

    return (
        <>
            <section>
                <h3 className="text-lg font-semibold text-center my-6">
                    Histórico Reservas
                </h3>
                {reservas.length > 0 ? (
                    reservas.map((reserva) => (
                        <div key={reserva.id} className="mb-8">
                            <div className="border p-4 my-2">
                                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 sm:gap-6">
                                    <Link to={`/grupo/${reserva.grupo_id}`}>
                                        <p className="font-semibold">Grupo :</p>
                                        {reserva.grupo_nombre}
                                    </Link>
                                    <Link to={`/sala/${reserva.sala_id}`}>
                                        <p className="font-semibold">Sala:</p>
                                        {reserva.sala_nombre}
                                    </Link>
                                    <p className="font-semibold">
                                        Estado:
                                        {reserva.confirmada === 0 ? (
                                            <span className="block font-normal text-red-600">
                                                Sin confirmar
                                            </span>
                                        ) : (
                                            <span className="block font-normal text-green-600">
                                                Confirmada
                                            </span>
                                        )}
                                    </p>
                                    <p>
                                        <span className="block font-semibold">
                                            Fecha:
                                        </span>
                                        {reserva.fecha}
                                    </p>
                                    <p>
                                        <span className="block font-semibold">
                                            Hora Inicio:
                                        </span>
                                        {reserva.horaInicio}
                                    </p>
                                    <p>
                                        <span className="block font-semibold">
                                            Hora Fin:
                                        </span>
                                        {reserva.horaFin}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <button
                                    onClick={() => handleConfirm(reserva.id)}
                                    hidden={
                                        type === 'grupo' ||
                                        reserva.confirmada === 1
                                    }
                                    disabled={type === 'grupo'}
                                    className={`button ${
                                        type === 'grupo'
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500'
                                    } text-white p-2 rounded`}
                                >
                                    Confirmar
                                </button>
                                {new Date(reserva.fecha) < new Date() ? (
                                    ''
                                ) : (
                                    <button
                                        onClick={() => handleDelete(reserva.id)}
                                        hidden={
                                            type === 'grupo' &&
                                            reserva.confirmada === 1
                                        }
                                        disabled={
                                            type === 'grupo' &&
                                            reserva.confirmada === 1
                                        }
                                        className="button bg-red-500 text-white p-2 rounded"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                            {new Date(reserva.fecha) < new Date() &&
                            reserva.confirmada === 1 ? (
                                <>
                                    {type === 'grupo' ? (
                                        <GrupoVotaSala
                                            idReserva={reserva.id}
                                            idGrupo={reserva.grupo_id}
                                            idSala={reserva.sala_id}
                                        />
                                    ) : (
                                        <SalaVotaGrupo
                                            idReserva={reserva.id}
                                            idGrupo={reserva.grupo_id}
                                            idSala={reserva.sala_id}
                                        />
                                    )}
                                </>
                            ) : (
                                ''
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center">
                        No se han encontrado reservas.
                    </p>
                )}
            </section>
        </>
    );
};

export default ListarReservas;
