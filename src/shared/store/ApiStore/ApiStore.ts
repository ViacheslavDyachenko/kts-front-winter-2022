import {ApiResponse, HTTPMethod, IApiStore, RequestParams, StatusHTTP} from "./types";

export default class ApiStore implements IApiStore {
    readonly baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async request<SuccessT, ErrorT = any, ReqT = {}>(params: RequestParams<ReqT>): Promise<ApiResponse<SuccessT, ErrorT>> {
        try {
            const url: string = `${this.baseUrl}${params.endpoint}`;
            let data: string | null = null;
            if (params.method === HTTPMethod.POST) {
                data = JSON.stringify(params.data);
            }
            const response = await fetch(url, {
                method: params.method,
                headers: params.headers,
                body: data,
            })
            if(!response.ok) throw new Error(`${StatusHTTP.NOT_FOUND}`);
            const jsonResp = await response.json();
            return {
                success: true,
                data: jsonResp,
                status: StatusHTTP.OK
            }
        } catch(e: any) {
            if(parseInt(e.message) === StatusHTTP.NOT_FOUND) {
                return {
                    success: false,
                    data: e,
                    status: StatusHTTP.NOT_FOUND,
                }
            }
            return {
                success: false,
                data: e,
                status: StatusHTTP.BAD_STATUS,
            }
        }
    }
}