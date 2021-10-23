import axios, { AxiosResponse, AxiosError } from 'axios';

import {
    ApiError, ChangedParams, CompanyFrame, CompanyFrameOptions, CompanyProperty,
    LoginInfo, LoginRequest, LogoutInfo, UserCredentials, UserInfo
} from '~/types';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
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

export const getToken = localStorage.getItem('Authorization');

if (getToken) {
    apiSetHeader('Authorization', `Bearer ${getToken}`);
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

export async function findServices(): Promise<string[]> {
    try {
        const { data } = await api.get('/findservs');
        return data;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function getCompanyProperties(): Promise<CompanyProperty[]> {
    try {
        const { data } = await api.get('/company/props');

        return data as CompanyProperty[];
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function changeCompanyProperties(values: ChangedParams): Promise<any> {
    try {
        const { data } = await api.post('/company/props', values);
        return data;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function getCompanyFrame(): Promise<CompanyFrame> {
    try {
        const { data } = await api.get('/company/frame');

        return data as CompanyFrame;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function getCompanyFrameOptions(): Promise<CompanyFrameOptions> {
    const getOptions = async (key: string): Promise<string[]> => {
        const { data } = await api.get(`ref/${key}`);

        return data as string[];
    };

    try {
        const keys = ['study', 'markets', 'services', 'techs'];
        const [study, markets, srvs, techs] = await Promise.all(keys.map(key => getOptions(key)));

        return { study, markets, srvs, techs };
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function changeCompanyFrame(newFrame: CompanyFrame): Promise<any> {
    try {
        const { data } = await api.post('/company/frame', newFrame);

        return data;
    }  catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}
