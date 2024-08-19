import getPool from './getPool.js';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar el paquete uuid

const populateDatabase = async () => {
    let pool;

    try {
        pool = await getPool();

        console.log('Poblando tablas...');

        // Insertar Usuarios
        const groupUsers = [];
        const venueUsers = [];
        
        // Crear usuarios tipo grupo
        for (let i = 1; i <= 24; i++) {
            groupUsers.push({
                id: uuidv4(),
                username: `grupoUser${i}`,
                email: `grupo${i}@example.com`,
                password: 'password',
                roles: 'grupo',
                active: true
            });
        }

        // Crear usuarios tipo sala
        for (let i = 1; i <= 6; i++) {
            venueUsers.push({
                id: uuidv4(),
                username: `salaUser${i}`,
                email: `sala${i}@example.com`,
                password: 'password',
                roles: 'sala',
                active: true
            });
        }

        // Insertar todos los usuarios
        for (const user of [...groupUsers, ...venueUsers]) {
            await pool.query(`
                INSERT INTO Usuarios (id, username, email, password, roles, active)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [user.id, user.username, user.email, user.password, user.roles, user.active]);
        }

        // Insertar Grupos
        for (const user of groupUsers) {
            const [provincias] = await pool.query(`SELECT id FROM Provincias ORDER BY RAND() LIMIT 1`);
            const provinciaId = provincias[0].id;
            await pool.query(`
                INSERT INTO Grupos (id, nombre, provincia, honorarios, usuario_id)
                VALUES (?, ?, ?, ?, ?)
            `, [uuidv4(), `Grupo de ${user.username}`, provinciaId, 500, user.id]);
        }

        // Insertar Salas
        for (const user of venueUsers) {
            for (let i = 1; i <= 4; i++) {
                const [provincias] = await pool.query(`SELECT id FROM Provincias ORDER BY RAND() LIMIT 1`);
                const provinciaId = provincias[0].id;
                await pool.query(`
                    INSERT INTO Salas (id, usuario_id, nombre, provincia, capacidad, direccion, horaReservasStart, horaReservasEnd)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [uuidv4(), user.id, `${user.username} Sala ${i}`, provinciaId, 100 + i * 10, `Calle ${i}`, '09:00', '22:00']);
            }
        }

        // Obtener todos los géneros musicales
        const [genreIds] = await pool.query(`SELECT id FROM Generos_musicales`);
        const allGenres = genreIds;

        const getRandomGenreId = () => allGenres[Math.floor(Math.random() * allGenres.length)].id;

        // Insertar Generos_salas
        for (const user of venueUsers) {
            const [salaIds] = await pool.query(`SELECT id FROM Salas WHERE usuario_id = ?`, [user.id]);
            for (const sala of salaIds) {
                await pool.query(`
                    INSERT INTO Generos_salas (id, salaId, generoId)
                    VALUES (?, ?, ?)
                `, [uuidv4(), sala.id, getRandomGenreId()]);
            }
        }

        // Insertar Generos_grupos
        for (const user of groupUsers) {
            const [grupoId] = await pool.query(`SELECT id FROM Grupos WHERE usuario_id = ?`, [user.id]);
            if (grupoId.length > 0) {
                await pool.query(`
                    INSERT INTO Generos_grupos (id, grupoId, generoId)
                    VALUES (?, ?, ?)
                `, [uuidv4(), grupoId[0].id, getRandomGenreId()]);
            }
        }

        // Insertar Sala_fotos y Grupo_fotos
        for (const user of venueUsers) {
            const [salaIds] = await pool.query(`SELECT id FROM Salas WHERE usuario_id = ?`, [user.id]);
            for (const sala of salaIds) {
                await pool.query(`
                    INSERT INTO Sala_fotos (id, name, salaId)
                    VALUES (?, ?, ?)
                `, [uuidv4(), `sala_${sala.id}_foto.jpg`, sala.id]);
            }
        }

        for (const user of groupUsers) {
            const [grupoId] = await pool.query(`SELECT id FROM Grupos WHERE usuario_id = ?`, [user.id]);
            if (grupoId.length > 0) {
                await pool.query(`
                    INSERT INTO Grupo_fotos (id, name, grupoId)
                    VALUES (?, ?, ?)
                `, [uuidv4(), `grupo_${grupoId[0].id}_foto.jpg`, grupoId[0].id]);
            }
        }

        // Insertar Grupo_media
        for (const user of groupUsers) {
            const [grupoId] = await pool.query(`SELECT id FROM Grupos WHERE usuario_id = ?`, [user.id]);
            if (grupoId.length > 0) {
                await pool.query(`
                    INSERT INTO Grupo_media (id, grupo_id, url)
                    VALUES (?, ?, ?)
                `, [uuidv4(), grupoId[0].id, `http://example.com/media/${grupoId[0].id}_media.mp3`]);
            }
        }

        // Insertar Reservas
        const [allSalaIds] = await pool.query(`SELECT id FROM Salas`);
        const [allGrupoIds] = await pool.query(`SELECT id FROM Grupos`);

        for (const reserva of allSalaIds) {
            for (const grupo of allGrupoIds) {
                await pool.query(`
                    INSERT INTO Reservas (id, sala_id, grupo_id, confirmada, fecha, horaInicio, horaFin)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [uuidv4(), reserva.id, grupo.id, false, '2024-08-15', '09:00', '12:00']);
            }
        }

        // Insertar votos_salas
        for (const reserva of allSalaIds) {
            for (const grupo of allGrupoIds) {
                const [reservaId] = await pool.query(`SELECT id FROM Reservas WHERE sala_id = ? AND grupo_id = ? LIMIT 1`, [reserva.id, grupo.id]);
                if (reservaId.length > 0) {
                    await pool.query(`
                        INSERT INTO votos_salas (id, voto, comentario, reservaId, grupoVota, salaVotada)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [uuidv4(), Math.floor(Math.random() * 5) + 1, 'Buen servicio', reservaId[0].id, grupo.id, reserva.id]);
                }
            }
        }

        // Insertar votos_grupos
        for (const reserva of allSalaIds) {
            for (const grupo of allGrupoIds) {
                const [reservaId] = await pool.query(`SELECT id FROM Reservas WHERE sala_id = ? AND grupo_id = ? LIMIT 1`, [reserva.id, grupo.id]);
                if (reservaId.length > 0) {
                    await pool.query(`
                        INSERT INTO votos_grupos (id, voto, comentario, reservaId, salaVota, grupoVotado)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [uuidv4(), Math.floor(Math.random() * 5) + 1, 'Excelente banda', reservaId[0].id, reserva.id, grupo.id]);
                }
            }
        }

        console.log('¡Datos insertados con éxito!');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

populateDatabase();
