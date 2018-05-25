export interface IUserSettings {
    ID: number;
    username: string;
    role: number;
}

export class User {
    private ID: number;
    private username: string;
    private role: number;
    private _isLogged: boolean;

    constructor(settings: IUserSettings) {
        this.ID = settings.ID;
        this.username = settings.username;
        this.role = settings.role;
        this._isLogged = true;
    }

    set isLogged(isLogged: boolean) {
        this._isLogged = isLogged;
    }

    get isLogged(): boolean {
        return this._isLogged;
    }
}