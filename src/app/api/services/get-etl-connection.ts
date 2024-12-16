import { AxiosResponse } from "axios";
import axiosClient from "../client";


const getEtlConnection = async (id? : string) => {
    const queryParams : any = {
        fields : ["id", "name", "database", "created_at", "updated_at", "host", "username", "port", "password", "db_client"],
    };

    if (id) {
        const response = await axiosClient.get(`/mt_etl_connection/${id}`, { params: queryParams });
        return response.data;
    }

    const response = await axiosClient.get("/mt_etl_connection", { params: queryParams });
    return response.data;
};

export default getEtlConnection;