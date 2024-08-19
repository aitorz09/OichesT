import getPool from '../../database/getPool.js';

export async function listSalasService(filters, sort) {
    const pool = await getPool();

   
    let query = `
        SELECT Salas.*, JSON_ARRAYAGG(JSON_OBJECT('id', sala_comments.id, 'comment', sala_comments.comment, 'created_at', sala_comments.created_at)) AS comments
        FROM Salas
        LEFT JOIN sala_comments ON Salas.id = sala_comments.sala_id
        WHERE 1=1
    `;
    const queryParams = [];

    // Filtros específicos
    
    if (filters.nombre) {
        query += ' AND Salas.nombre LIKE ?'
        queryParams.push(`%${filters.nombre}%`)
    }
  
    if(filters.direccion){
        query += ' AND Salas.direccion = ?'
        queryParams.push(filters.direccion)
    }

    // Ordenamiento
    if (sort && sort.field && sort.order) {
        query += ` ORDER BY ${sort.field} ${sort.order}`;
    }

    const [rows] = await pool.query(query, queryParams);
    return rows;
}