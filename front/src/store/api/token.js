export const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
}

export const resetToken = () => {
    localStorage.removeItem('token');
}

export const setToken = (token) => {
    localStorage.setItem('token', token);
}