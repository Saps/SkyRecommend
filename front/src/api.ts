import axios, { AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import {
    ApiError, ChangedParams, CompanyCandidate, CompanyFrame, CompanyFrameOptions, CompanyProperty,
    LoginInfo, LoginRequest, LogoutInfo, SurveyValues, UserCredentials, UserInfo,
} from '~/types';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiSetHeader = (name: string, value: string) => {
    if (api.defaults.headers.common && value) {
        api.defaults.headers.common[name] = value;
    }
};

const apiDeleteHeader = (name: string) => {
    if (api.defaults.headers.common) {
        delete api.defaults.headers.common[name];
    }
};

const getToken = Cookies.get('Authorization');

if (getToken) {
    apiSetHeader('Authorization', `Bearer ${getToken}`);
}

export async function login(credentials: UserCredentials): Promise<LoginInfo> {
    try {
        const { data } = await api.post<LoginRequest, AxiosResponse<LoginInfo>>('/user/login', credentials);

        Cookies.set('Authorization', data.access_token, { expires: 1 });
        apiSetHeader('Authorization', `Bearer ${data.access_token}`);

        return data;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function logout(): Promise<LogoutInfo> {
    try {
        const { data } = await api.get('/user/logout');

        Cookies.remove('Authorization');
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

export async function getQuestions(): Promise<string[]> {
    try {
        const { data } = await api.get('/quest');

        return data;
    }  catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function sendSurvey(values: SurveyValues): Promise<any> {
    try {
        const { data } = await api.post('/quest', values);

        return data;
    }  catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function findCompanies(isActive: boolean): Promise<CompanyCandidate[]> {
    try {
        const url = isActive ? '/candapi/algor' : '/candapi/algor/all';
        const { data } = await api.get(url);
        
        return data;
    }  catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}
