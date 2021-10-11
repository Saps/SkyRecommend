import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiError, LoginInfo, LoginRequest, LogoutInfo, UserCredentials, UserInfo } from './types';

const api = axios.create({
    baseURL: 'http://185.221.152.242:5480/api',
    headers: {
        'Content-Type': 'application/json'
    },
});

export async function login(credentials: UserCredentials): Promise<LoginInfo> {
    try {
        const { data } = await api.post<LoginRequest, AxiosResponse<LoginInfo>>('/user/login', credentials);
        return data;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function logout(): Promise<LogoutInfo> {
    try {
        const { data } = await api.get('/user/logout');
        return data as LogoutInfo;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function currentUser(access_token: string): Promise<UserInfo> {
    try {
        const { data } = await api.get('/user/current', { headers: { Authorization: `Bearer ${access_token}` } });
        return data as UserInfo;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}
