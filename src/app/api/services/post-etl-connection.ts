import axiosClient from "../client";

export const postEtlConnection = async (data: any) => {
    const response = await axiosClient.post("/mt_etl_connection", data);
    return response.data;
};
