import useAuth from '../hooks/useAuth.jsx'
export async function GetReservasById  () {
const { VITE_API_URL_BASE } = import.meta.env;
  const {token} = useAuth()
  const url = `${VITE_API_URL_BASE}/reservas/:sala_id`; 
  const response = await fetch(url,{
    headers: {
      token: token,
  },
})
const data = response.json()
return data
}