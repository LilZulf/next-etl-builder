import axiosClient from "../client";
const deleteEtlConnection = async (id: string) => {
    const response = await axiosClient.delete(`/mt_etl_connection/${id}`);
    return response.data;
}

export default deleteEtlConnection