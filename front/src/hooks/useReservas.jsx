import  useAuth  from './useAuth.jsx';

const useGetReservasById = () => {
  const { token } = useAuth();

  const GetReservasById = async () => {
    const response = await fetch('/api/reservas', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  };

  return GetReservasById;
};

export default useGetReservasById;