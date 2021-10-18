import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiError, LoginInfo, LoginRequest, LogoutInfo, UserCredentials, UserInfo } from './types';

const api = axios.create({
    baseURL: 'http://185.221.152.242:5480/api',
    headers: {
        'Content-Type': 'application/json'
    },
});

const apiSetHeader = (name: string, value: string) => {
    if (api.defaults.headers && value) {
        api.defaults.headers[name] = value;
    }
};

const apiDeleteHeader = (name: string) => {
    if (api.defaults.headers) {
        delete api.defaults.headers[name];
    }
};

const token = localStorage.getItem('Authorization');
if (token) {
    apiSetHeader('Authorization', `Bearer ${token}`);
}

export async function login(credentials: UserCredentials): Promise<LoginInfo> {
    try {
        const { data } = await api.post<LoginRequest, AxiosResponse<LoginInfo>>('/user/login', credentials);
        localStorage.setItem('Authorization', data.access_token);
        apiSetHeader('Authorization', `Bearer ${data.access_token}`);
        return data;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function logout(): Promise<LogoutInfo> {
    try {
        const { data } = await api.get('/user/logout');
        localStorage.removeItem('Authorization');
        apiDeleteHeader('Authorization');
        
        return data as LogoutInfo;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function currentUser(): Promise<UserInfo> {
    try {
        const { data } = await api.get('/user/current');
        return data as UserInfo;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}
