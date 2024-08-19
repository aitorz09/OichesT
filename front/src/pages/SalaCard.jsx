import React from 'react';
import Defaultimg from '../assets/noimage.png'
const SalaCard = ({ sala }) => {
    const imageUrl = `${import.meta.env.VITE_API_URL_BASE}/uploads/${
        sala.primera_foto
    }`;
    console.log(sala);
    return (
        <div className="sala-card bg-gray-800 text-white rounded-lg shadow-lg p-0">
            <img
                src={sala.primera_foto ? imageUrl : Defaultimg}
                alt={sala.nombre}
                className="sala-card-image w-full h-full object-cover rounded-lg p-0"
            />
            <h2 className="sala-card-title text-xl font-bold mt-4">
                {sala.nombre}
            </h2>
            <p className="sala-card-genre text-gray-400">{sala.Genero}</p>
            <p className="sala-card-province text-gray-400">{sala.Provincia}</p>
            <p className="sala-card-votes text-gray-400">
                Votos: {sala.media_votos}
            </p>
        </div>
    );
};

export default SalaCard;