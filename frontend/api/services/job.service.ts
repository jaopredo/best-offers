import APISource from '../source'

/* TIPOS */
import {
    Job,
    JobApiResponse,
    JobServiceInterface
} from "@/types/api/services/job.service"
import { ApiPaginationResponse, Pagination } from '@/types/api'


export default class JobService implements JobServiceInterface {
    source = new APISource('job')

    async get (id: number) {
        try {
            return await this.source.get<JobApiResponse>(`${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async getAll (pagination?: Pagination) {
        try {
            return await this.source.get<ApiPaginationResponse<Job>>('', {
                params: pagination
            })
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async delete (id: number) {
        try {
            return await this.source.delete<JobApiResponse>(`${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }
}
