export interface IUserSettings {
    ID: number;
    username: string;
    role: number;
}

export class User {
    private ID: number;
    private username: string;
    private role: number;

    constructor(settings: IUserSettings) {
        this.ID = settings.ID;
        this.username = settings.username;
        this.role = settings.role;
    }
}