import {Component, OnInit} from "@angular/core";
import { LoginService } from "../../services/login.service";

@Component({
    selector: "home",
    moduleId: module.id,
    templateUrl: "./homeView.html",
    providers: [ LoginService ]
})
export class HomeComponent implements OnInit {
    private ids = 5;

    constructor(private loginService: LoginService) {
    }

    ngOnInit(): void {
        this.ids = 78;
    }
    public onTap() {
        this.loginService.logout();
    }
}
