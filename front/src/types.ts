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

export interface CommonError {
    message: string;
}

export interface CompanyProperty {
    group_name: string;
    params: CompanyParam[];
}

export interface CompanyParam {
    id: number;
    list_of_values: Value[] | null;
    name: string;
    value: string | null;
}

export interface Value {
    id: string | number;
    value: string | null;
}

export interface FieldValues {
    [id: number]: string;
}

export interface ChangedParams {
    changed_params: Value[];
}

export interface CompanyFrame {
    company_name: string;
    inn: string;
    okved_osn: string;
    okved_dop: string;
    markets: string[];
    srvs: string[];
    study: string;
    techs: string[];
}

export interface CompanyFrameOptions {
    markets: string[];
    srvs: string[];
    study: string[];
    techs: string[];
}

export interface SurveyValues {
    [key: string]: number;
}

export interface Recommendations {
    needs: string[];
    servs: string[];
}

interface AlgorithmInfo {
    a_message: string;
    a_name: string;
}

export interface CompanyCandidate {
    name: string;
    rating: number;
    type: string;
    algos: AlgorithmInfo[];
}

export interface ServiceListResponse {
    result: ServiceItem[];
    total: number;
}

export interface ServiceItem {
    eff_rating: null;
    formal_rating: null;
    id: number;
    serv_name: string;
    serv_type: string;
}

export interface AlgorithmData {
    id: number;
    is_enabled: number;
    weight: number;
}

export interface ExtendedAlgorithmData extends AlgorithmData {
    caption: string;
    name: string;
}

export interface ServiceGraph {
    nodes: ServiceGraphNode[];
    edges: ServiceGraphEdge[];
}

export interface ServiceGraphNode {
    id: number;
    caption: string;
    color: string;
}

export interface ServiceGraphEdge {
    id: number;
    from: number;
    to: number;
}
