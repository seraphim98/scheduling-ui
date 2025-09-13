import isDev from "../helpers/EnvironmentHelper";
import axios, { AxiosResponse, isAxiosError } from "axios";
import UpsertRequest from "../models/PostRequest";
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

    async sendRequest(request: Promise<AxiosResponse<any>>,) { 
        try {
            const response = await request;
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                console.error(`API request failed with response code: ${error.code} `);
                throw error.message;
            }
            throw new Error('An unexpected error occurred');
        }
    }

    async createRecord(upsertRequest: UpsertRequest, entity: string) {
        const url = `${this.baseUrl}/${entity}`;
        console.log(upsertRequest.data)
        const response = await this.sendRequest(axios.post(url, JSON.parse(upsertRequest.data), this.headers)); //Should it be entity specific???
        return response;    
    }

    async updateRecord(upsertRequest: UpsertRequest, entity: string) {
        const url = `${this.baseUrl}/${entity}/${upsertRequest.id}`;
        const response = await this.sendRequest(axios.put(url, JSON.parse(upsertRequest.data), this.headers));
        return response;
    }

    async deleteRecord(id: string, entity: string) {
        const url = `${this.baseUrl}/${entity}/${id}`;
        await this.sendRequest(axios.delete(url, this.headers));
    }

    async getRecords(entity: string) {
        const url = `${this.baseUrl}/${entity}`;
        const response = await this.sendRequest(axios.get(url, this.headers));
        return response;
    }
}