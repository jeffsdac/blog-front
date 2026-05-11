export interface PageResponseDTO<T> {
    items: T[];
    limit: number;
    offset: number;
    total: number;
}
