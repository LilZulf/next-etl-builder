interface EtlConnectionResponse {
    id: string;
    name: string;
    database: string;
    host: string;
    username: string;
    port: number;
    password: string;
    db_client: string;
    created_at: string;
    updated_at: string;
}

export default EtlConnectionResponse