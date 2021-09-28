import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {BackPath, LocalCalls} from '../configureStore';

import { getToken, resetToken } from './token';

const createAxios = () => {
    const axiosInstance = axios.create({
        baseURL: BackPath
    });

    axiosInstance.interceptors.request.use((config: any) => {
        config.headers.common['Authorization'] = `Bearer ${getToken()}`;
        config.baseURL = BackPath;
        return config;
    });

    axiosInstance.interceptors.response.use((response: any) => response, (error: any) => {
        if (error.response && error.response.status === 401) {
            resetToken();
        }
        return Promise.reject(error);
    });

    return axiosInstance;
}

export const createGetCall = (way : any, in_mock : any) => {
    if (LocalCalls != 'true') {
        return createAxios().get(`${BackPath}${way}`);
    }
    else {
        var call = createAxios();
        var mock = new MockAdapter(call, { delayResponse: 1000 });
        mock.onGet(`${BackPath}${way}`).reply(200, in_mock);
        return call.get(`${BackPath}${way}`);
    }
}

export const createPostCall = (way : any, data : any, in_mock : any) => {
    if (LocalCalls != 'true') {
        return createAxios().post(`${BackPath}${way}`, data);
    }
    else {
        var call = createAxios();
        var mock = new MockAdapter(call, { delayResponse: 1000 });
        mock.onPost(`${BackPath}${way}`).reply(200, in_mock);
        return call.post(`${BackPath}${way}`, data);
    }
}



export default createAxios;