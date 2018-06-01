import {HttpHeaders} from "@angular/common/http";
import * as appSettings from "application-settings";

export const API_URL = "http://10.0.2.2:51246/api/";

export function getUnauthorizedHeaders(): HttpHeaders{
    return new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    });
}

export function getAuthorizedHeaders(): HttpHeaders {
    return new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        "token": appSettings.getString("token")
    });
}