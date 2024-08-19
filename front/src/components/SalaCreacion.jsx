import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth/auth.context.jsx';
import { toast } from 'react-toastify';
import Toastify from './Toastify.jsx';
import { useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import { IoIosCloseCircleOutline } from 'react-icons/io';

import FetchProvinciasService from '../services/FetchProvinciasService.js';
import FetchGenresService from '../services/FetchGenresService.js';
import registerSalaService from '../services/registerSalaService.js';

const SalaCreacion = () => {
    const { userLogged, setUserLogged, currentUser, token } =
        useContext(AuthContext);

    const navigate = useNavigate();

    const [formValues, setFormValues] = useState({
        nombre: '',
        direccion: '',
        provincia: '',
        generos: [],
        capacidad: '',
        descripcion: '',
        precios: '',
        condiciones: '',
        equipamiento: '',
        horaReservasStart: '',
        horaReservasEnd: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [genres, setGenres] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [photos, setPhotos] = useState({
        photoA: null,
        photoB: null,
        photoC: null,
        photoD: null,
    });
    const [previews, setPreviews] = useState({
        previewUrlA: null,
        previewUrlB: null,
        previewUrlC: null,
        previewUrlD: null,
    });
    const [error, setError] = useState('');
    const [resp, setResp] = useState('');

    useEffect(() => {
        FetchProvinciasService(setProvinces);
        FetchGenresService(setGenres);
    }, []);

    const handleGenChange = (selectedList) => {
        const selectedGenres = selectedList.map((genre) => genre.id);
        setGeneros(selectedGenres);
        setFormValues((prevValues) => ({
            ...prevValues,
            generos: selectedGenres,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormValues({ ...formValues, [name]: value });
    };

    const handleFileChange = (e, name) => {
        const file = e.target.files[0];
        setPhotos({ ...photos, [name]: file });
        setPreviews({
            ...previews,
            [`previewUrl${name.charAt(name.length - 1).toUpperCase()}`]:
                URL.createObjectURL(file),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(formValues).forEach(([key, value]) => {
            if (key === 'generos') {
                value.forEach((genre) => formData.append('generos', genre));
            } else {
                if (value) formData.append(key, value);
            }
        });
        Object.entries(photos).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        try {
            const response = await registerSalaService({ token, formData });

            setResp(response);
            if (response.status === 'ok') {
                const nuevaSala = response.data.sala;
                const updatedSalas = [...userLogged.salas, nuevaSala];
                const updatedUser = { ...userLogged, salas: updatedSalas };

                setUserLogged(updatedUser);
            }

            toast.success('Has creado tu nueva sala con éxito');
            navigate('/users');
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
    };

    const {
        nombre,
        direccion,
        provincia,
        // generos,
        capacidad,
        descripcion,
        precios,
        condiciones,
        equipamiento,
        horaReservasStart,
        horaReservasEnd,
    } = formValues;

    return currentUser ? (
        <>
            <form onSubmit={handleSubmit} className="md:flex md:flex-wrap">
                <div className="md:w-3/5 md:flex md:flex-wrap md:justify-between">
                    <div className="flex flex-col mb-4 md:w-[calc(50%-0.5rem)]">
                        <label htmlFor="nombre" className="font-semibold">
                            Nombre de la Sala:*
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre de la sala"
                            value={nombre}
                            required
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="flex flex-col mb-4 md:w-[calc(50%-0.5rem)]">
                        <label htmlFor="generos" className="font-semibold mb-2">
                            Géneros:
                        </label>
                        <Multiselect
                            options={genres.map((genre) => ({
                                id: genre.id,
                                nombre: genre.nombre,
                            }))}
                            selectedValues={generos.map((genreId) =>
                                genres.find((genre) => genre.id === genreId)
                            )}
                            onSelect={handleGenChange}
                            onRemove={handleGenChange}
                            displayValue="nombre"
                            placeholder="Selecciona los géneros"
                            customCloseIcon={
                                <IoIosCloseCircleOutline className="ml-1" />
                            }
                            style={{
                                chips: {
                                    background: '#ffb500',
                                    color: 'black',
                                },
                            }}
                        />
                    </div>
                    <div className="flex flex-col mb-4 md:w-full">
                        <label htmlFor="direccion" className="font-semibold">
                            Dirección:*
                        </label>
                        <input
                            type="text"
                            name="direccion"
                            placeholder="Dirección de la sala"
                            value={direccion}
                            required
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="flex flex-col mb-4 md:w-[calc(33%-0.5rem)]">
                        <label htmlFor="provincia" className="font-semibold">
                            Provincia:*
                        </label>
                        <select
                            id="provincia"
                            name="provincia"
                            required
                            value={provincia}
                            className="form-select"
                            onChange={handleChange}
                        >
                            <option value="">Selecciona</option>
                            {provinces.map((province) => (
                                <option key={province.id} value={province.id}>
                                    {province.provincia}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col mb-4 md:w-[calc(33%-0.5rem)]">
                        <label htmlFor="capacidad" className="font-semibold">
                            Aforo:*
                        </label>
                        <input
                            type="number"
                            name="capacidad"
                            placeholder="Aforo de la sala"
                            required
                            value={capacidad}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="flex flex-col mb-4 md:w-[calc(33%-0.5rem)]">
                        <label htmlFor="precios" className="font-semibold">
                            Precios:
                        </label>
                        <input
                            type="number"
                            name="precios"
                            placeholder="Tarifa para los grupos"
                            value={precios}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="flex flex-col mb-4 md:w-full">
                        <label htmlFor="descripcion" className="font-semibold">
                            Descripción:
                        </label>
                        <textarea
                            name="descripcion"
                            value={descripcion}
                            onChange={handleChange}
                            className="form-textarea"
                            maxLength="2000"
                        ></textarea>
                        <p className="mt-1 text-gray-500 text-sm">
                            2000 caracteres como máximo
                        </p>
                    </div>
                    <div className="flex flex-col mb-4 md:w-full">
                        <label htmlFor="condiciones" className="font-semibold">
                            Condiciones:
                        </label>
                        <textarea
                            type="text"
                            name="condiciones"
                            value={condiciones}
                            onChange={handleChange}
                            className="form-textarea"
                            maxLength="2000"
                        ></textarea>
                        <p className="mt-1 text-gray-500 text-sm">
                            2000 caracteres como máximo
                        </p>
                    </div>
                    <div className="flex flex-col mb-4 md:w-full">
                        <label htmlFor="equipamiento" className="font-semibold">
                            Equipamiento:
                        </label>
                        <textarea
                            type="text"
                            name="equipamiento"
                            value={equipamiento}
                            onChange={handleChange}
                            className="form-textarea"
                            maxLength="2000"
                        ></textarea>
                        <p className="mt-1 text-gray-500 text-sm">
                            2000 caracteres como máximo
                        </p>
                    </div>
                    <div className="flex flex-col mb-4 md:w-[calc(50%-0.5rem)]">
                        <label
                            htmlFor="horaReservasStart"
                            className="font-semibold"
                        >
                            Hora de inicio de reservas:*
                        </label>
                        <input
                            type="time"
                            name="horaReservasStart"
                            required
                            value={horaReservasStart}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="flex flex-col mb-4 md:w-[calc(50%-0.5rem)]">
                        <label
                            htmlFor="horaReservasEnd"
                            className="font-semibold"
                        >
                            Hora final de reservas:*
                        </label>
                        <input
                            type="time"
                            name="horaReservasEnd"
                            required
                            value={horaReservasEnd}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="pt-4 md:w-2/5 md:pl-12 md:pt-0 md:flex md:flex-wrap md:flex-col md:items-center">
                    <p className="block font-medium mb-4 md:w-full text-center">
                        Fotos de la sala
                    </p>
                    {['A', 'B', 'C', 'D'].map((key) => (
                        <div className="mb-4 flex flex-wrap gap-4" key={key}>
                            <section className="sect-photo">
                                <span className="border-photos">
                                    {previews[`previewUrl${key}`] ? (
                                        <img
                                            src={previews[`previewUrl${key}`]}
                                            alt="Vista previa"
                                            width={'200px'}
                                        />
                                    ) : (
                                        <span>Sube una foto</span>
                                    )}
                                    <input
                                        type="file"
                                        name={`photo${key}`}
                                        className="absolute w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) =>
                                            handleFileChange(e, `photo${key}`)
                                        }
                                    />
                                </span>
                            </section>
                        </div>
                    ))}
                </div>
                <div className="my-12 max-w-80">
                    <input
                        type="submit"
                        value="Crear Sala"
                        className="btn-account p-3 w-full"
                    />
                </div>
                <div>
                    {error && <p>{error}</p>}
                    {resp.status === 'ok' && <p>{resp.message}</p>}
                </div>
            </form>
            <Toastify />
        </>
    ) : (
        <h1 className="text-center text-xl">No puedes acceder a esta página</h1>
    );
};

export default SalaCreacion;
