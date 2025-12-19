import { IsEnum, IsOptional } from "class-validator"
import { PaginationQueryParams } from "types/pagination/pagination.dto"


export enum JobStatusEnum {
    RUNNING = 'running',
    FAILED = 'failed',
    SUCCESS = 'success'
}


export class JobPaginationQueryDto extends PaginationQueryParams {
    @IsOptional()
    @IsEnum(JobStatusEnum)
    status: JobStatusEnum
}
