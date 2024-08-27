

export type AuditableInput<T> = {
    data: T;
    audit: {
        author: number;
        operation: string;
    }
}