import {HttpHeaders} from "@angular/common/http";
import * as appSettings from "application-settings";

//export const API_URL = "http://10.0.2.2:51246/api/";
export const API_URL = "http://www.nohe.cz/api/";
export const APP_SET_TOKEN = "token";
export const APP_SET_GPS_ACTIVE = "gps_active";
export const SEND_GPS_IN_MILISECONDS = 8000;

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