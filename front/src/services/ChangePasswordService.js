const ChangePasswordService = async (dataForm) => {
    console.log('DF ', dataForm);
    const { VITE_API_URL_BASE } = import.meta.env;

    const url = `${VITE_API_URL_BASE}/users/password`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataForm),
    });

    const json = await response.json();

    if (!response.ok) throw new Error(json.message);

    return json;
};

export default ChangePasswordService;
