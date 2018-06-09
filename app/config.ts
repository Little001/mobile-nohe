import {HttpHeaders} from "@angular/common/http";
import * as appSettings from "application-settings";

export const API_URL = "http://10.0.2.2:51246/api/";
export const APP_SET_TOKEN = "token";
export const APP_SET_LAST_ROUTE = "last_route";
export const APP_SET_WAS_SUSPENDED = "was_suspended";
export const APP_SET_GPS_ACTIVE = "gps_active";
export const APP_SET_PHOTO_1 = "photo_1";
export const APP_SET_PHOTO_2 = "photo_2";
export const APP_SET_PHOTO_3 = "photo_3";
export const APP_SET_PHOTO_4 = "photo_4";
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