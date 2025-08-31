import { Axios } from "./Axios";
import { camelizeKeys, decamelizeKeys } from "humps";

const API_URL = "https://januari-juni.smarteschool.net";

const client = (
    endpoint,
    { body, method, headers, params, responseType } = {}
) => {
    headers = {
        ...headers,
        "content-type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("ss-token"))}`,
    };

    const config = {
        url: `${API_URL}/${endpoint}`,
        headers: {
            ...headers
        },
        responseType: "json",
        method: method || "GET"
    };

    if (params) {
        config.params = decamelizeKeys(params);
    }

    if (body) {
        config.data = decamelizeKeys(body);
    }

    if (responseType) {
        config.responseType = responseType;
    }

    const onSuccess = (res) => {
        let data = res?.data || null;

        if (res.headers["content-type"].split(";")[0] !== "application/json") {
            return {
                isSuccess: true,
                error: false,
                data,
                fileName: res.headers["content-disposition"].split("filename=")[1],
                status: res?.status
            };
        }

        data = camelizeKeys(data);
        return {
            isSuccess: true,
            error: false,
            data,
            status: res?.status
        };
    };

    const onError = (err) => {
        let error = err?.response?.data;
        error = camelizeKeys(error);

        return {
            isSuccess: false,
            data: err?.data,
            error,
            status: err?.response?.status
        };
    };

    return Axios(config).then(onSuccess).catch(onError);
};

export const getAllHistories = (params) => {
    return client("eresource/history-user", { params });
}; 

export const getHistory = (id, params) => {
    return client(`eresource/history/${id}`, { params });
}; 