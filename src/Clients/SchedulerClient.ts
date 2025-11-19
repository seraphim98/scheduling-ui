import isDev from "../helpers/EnvironmentHelper";
import axios, { AxiosResponse, isAxiosError } from "axios";
import UpsertRequest from "../models/UpsertRequest";
import ApiHandlerOptions from "../props/SchedulerClientOptions";

export default class SchedulerClient {
    constructor(options: ApiHandlerOptions) {
        this.baseUrl = options.baseUrl;
        if (isDev()) {
            this.baseUrl = "https://localhost:7071/api";
        }
        this.authToken = options.authToken;
        if (this.authToken === "") {
            this.headers = {
                'Authorization': `Bearer ${this.authToken}`
            };
        }
    }

    private baseUrl: string;
    private authToken: string;
    private headers?: { [key: string]: string };

    async send(request: Promise<AxiosResponse<any>>,) { 
        try {
            const response = await request;
            return response.data;
        } catch (error) {
            console.log(error);
            if (isAxiosError(error)) {
                console.error(`API request failed with response code: ${error.code} `);
                throw error.message;
            }
            throw new Error('An unexpected error occurred');
        }
    }

    async create(upsertRequest: UpsertRequest, entity: string) {
        const url = `${this.baseUrl}/${entity}`;
        console.log(JSON.parse(upsertRequest.data));
        const response = await this.send(axios.post(url, JSON.parse(upsertRequest.data), this.headers));
        return response;    
    }

    async update(upsertRequest: UpsertRequest, entity: string) {
        const url = `${this.baseUrl}/${entity}/${upsertRequest.id}`;
        const response = await this.send(axios.put(url, JSON.parse(upsertRequest.data), this.headers));
        return response;
    }

    async delete(id: string, entity: string) {
        const url = `${this.baseUrl}/${entity}/${id}`;
        await this.send(axios.delete(url, this.headers));
    }

    async list(entity: string) {
        const url = `${this.baseUrl}/${entity}`;
        const response = await this.send(axios.get(url, this.headers));
        return response;
    }

    async get(id: string, entity: string) {
        const url = `${this.baseUrl}/${entity}/${id}`;
        const response = await this.send(axios.get(url, this.headers));
        return response;
    }
}