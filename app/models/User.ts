export interface IUserSettings {
    ID: number;
    username: string;
    role: number;
    name: string;
    surname: string;
}

export class User {
    private ID: number;
    private username: string;
    private role: number;
    private name: string;
    private surname: string;

    constructor(settings: IUserSettings) {
        this.ID = settings.ID;
        this.username = settings.username;
        this.role = settings.role;
        this.name = settings.name;
        this.surname = settings.surname;
    }
}