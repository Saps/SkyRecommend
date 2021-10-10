import axios, { AxiosResponse, AxiosError } from 'axios';

const api = axios.create({ baseURL: 'http://localhost:7200/api' });

interface UserInfo {
    email: string;
    id: number;
    params: null;
    username: string;
    role: string;
}

interface LoginInfo {
    access_token: string;
    user_role: string;
}

interface LogoutInfo {
    ok: boolean;
}

interface LoginRequest {
    username: string;
    password: string;
}

interface ApiError {
    error: boolean;
    message: string;
}

async function login(username: string, password: string): Promise<LoginInfo> {
    try {
        const { data } = await api.post<LoginRequest, AxiosResponse<LoginInfo>>('/user/login', { username, password });

        return data;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

async function logout(): Promise<LogoutInfo> {
    try {
        const { data } = await api.get('/user/logout');

        return data as LogoutInfo;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

async function currentUser(): Promise<UserInfo> {
    try {
        const { data } = await api.get('/user/current');

        return data as UserInfo;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export { login, logout, currentUser };
