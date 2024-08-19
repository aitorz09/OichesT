export const getRoomService = async (roomId, token) => {
  const { VITE_API_URL_BASE } = import.meta.env;
  
  const url = `${VITE_API_URL_BASE}/salas/${roomId}`;
  
  const response = await fetch(url, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      }
  });

  const json = await response.json();

  if (!response.ok) throw new Error(json.message);
  
  return json;
};

export const saveRoomService = async (roomData, roomId, token) => {
  const { VITE_API_URL_BASE } = import.meta.env;
  
  const url = `${VITE_API_URL_BASE}/salas${roomId ? `/${roomId}` : ''}`;
  
  const response = await fetch(url, {
      method: roomId ? "PUT" : "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(roomData)
  });

  const json = await response.json();

  if (!response.ok) throw new Error(json.message);
  
  return json;
};

export default { getRoomService, saveRoomService };