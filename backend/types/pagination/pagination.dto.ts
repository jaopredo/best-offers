
export interface Pagination<T> {
    data: Array<T>
    metadata: {
        page: number,
        limit: number,
        total: number,
        totalPages: number
    }
}
