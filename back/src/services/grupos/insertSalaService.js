// Importamos las dependencias.
import { v4 as uuid } from 'uuid';

import getPool from '../../database/getPool.js';

const insertSalaService = async (
    nombre,
    provincia,
    generos,
    capacidad,
    descripcion,
    precios,
    direccion,
    condiciones,
    equipamiento,
    email,
    usuario_id
) => {
    const pool = await getPool();

    // Generamos el id de la entrada.
    const salaId = uuid();

    await pool.query(
        `
            INSERT INTO salas (id, provincia, generos, usuario_id,nombre,capacidad,descripcion,precios,direccion,condiciones,equipamiento,email)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
            salaId,
            provincia,
            generos,
            usuario_id,
            nombre,
            capacidad,
            descripcion,
            precios,
            direccion,
            condiciones,
            equipamiento,
            email,
        ]
    );

    return salaId;
};

export default insertSalaService;
