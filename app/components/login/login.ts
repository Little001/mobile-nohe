import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "login",
    moduleId: module.id,
    templateUrl: "./loginView.html",
})
export class LoginComponent  implements OnInit  {
    private ids = 8;

    constructor(private routerExtensions: RouterExtensions) {
    }


    ngOnInit(): void {
        this.ids = 68;

    }

    public onTap() {
        this.routerExtensions.navigate(["/home"]);
    }
}
