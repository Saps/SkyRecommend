export interface UserCredentials {
    username: string;
    password: string;
}

export interface UserInfo {
    email: string;
    id: number;
    params: null;
    username: string;
    role: string;
}

export interface FullUserInfo extends UserInfo {
    access_token: string;
}

export interface LoginInfo {
    access_token: string;
    user_role: string;
}

export interface LogoutInfo {
    ok: boolean;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface ApiError {
    error: boolean;
    message: string;
}
