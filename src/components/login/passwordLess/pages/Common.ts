import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Common() {
    
    const { i18n } = useTranslation();
    const changeLanguage = (language: string) => {
        console.log(language);
        sessionStorage.setItem("language", language);
        i18n.changeLanguage(language);
    };
    
    // API
    const apiRequest = async (method: string, url: string, data: any, config: any) => {
        let response: any = "";
        try {
            if (method === "get") response = await axios.get(url, config);
            if (method === "post") response = await axios.post(url, data, config);
            if (method === "patch") response = await axios.patch(url, data, config);
            if (method === "put") {
                if (data === null) response = await axios.put(url, config);
                else response = await axios.put(url, data, config);
            }
            if (method === "delete") response = await axios.delete(url, config);
            if (response !== "") response = response.data;
        } catch (error) {
            console.log(error);
        }
        return response;
    };
    return {
        changeLanguage,
        apiRequest
    };
}

export { Common };