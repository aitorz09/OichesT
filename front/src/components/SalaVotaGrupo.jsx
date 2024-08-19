import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/auth/auth.context.jsx';
import salaVotaGrupoService from '../services/salaVotaGrupoService.js';

const SalaVotaGrupo = ({ idReserva, idSala, idGrupo }) => {
    const { token, userLogged } = useContext(AuthContext);
    const { VITE_API_URL_BASE } = import.meta.env;

    const [voto, setVoto] = useState(0);
    const [comment, setComment] = useState('');
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const fetchVotos = async () => {
            try {
                const url = `${VITE_API_URL_BASE}/salas/votos/${idSala}`;

                const response = await fetch(url);
                const votosData = await response.json();

                const votoExistente = votosData.data.salaVotos.find(
                    (voto) =>
                        voto.reservaId === idReserva ||
                        voto.grupoVotado === idGrupo
                );

                if (votoExistente) {
                    setHasVoted(true);
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchVotos();
    }, [VITE_API_URL_BASE, idGrupo, idReserva, idSala]);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const data = new FormData();
            data.append('voto', voto);
            data.append('comment', comment);

            await salaVotaGrupoService({ data, idReserva, token });

            toast.success('Tu voto a sido publicado');
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (!userLogged || userLogged.roles !== 'sala') {
        return null;
    }

    if (hasVoted) {
        return (
            <p className="text-center text-yellowOiches font-semibold">
                Ya has votado a este grupo
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <h2 className="text-lg font-semibold mb-4">
                Comenta tu experiencia
            </h2>
            <div className="mb-4">
                <label className="font-semibold md:mr-4">Puntuación:</label>
                <input
                    type="number"
                    name="voto"
                    placeholder="Puntuación del 1 al 5"
                    min="1"
                    max="5"
                    required
                    onChange={(e) => setVoto(e.target.value)}
                    className="form-input md:max-w-48"
                />
            </div>
            <div>
                <label className="font-semibold">Comentario:</label>
                <textarea
                    name="comment"
                    onChange={(e) => setComment(e.target.value)}
                    className="form-textarea md:min-h-20"
                ></textarea>
            </div>
            <div className="mt-3 max-w-56">
                <input
                    type="submit"
                    value="Votar"
                    className="btn-account p-3 w-full"
                />
            </div>
        </form>
    );
};
export default SalaVotaGrupo;
