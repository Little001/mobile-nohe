"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var login_service_1 = require("../../services/login.service");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(loginService) {
        this.loginService = loginService;
        this.userName = "";
        this.passWord = "";
    }
    LoginComponent.prototype.submit = function () {
        this.loginService.login()
            .subscribe(function (result) {
            alert(JSON.stringify(result));
        }, function (error) {
            console.log(JSON.stringify(error));
            alert(JSON.stringify(error));
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: "login",
            moduleId: module.id,
            templateUrl: "./loginView.html",
            providers: [login_service_1.LoginService]
        }),
        __metadata("design:paramtypes", [login_service_1.LoginService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2dpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEwQztBQUMxQyw4REFBNEQ7QUFTNUQ7SUFJSSx3QkFBb0IsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFIdkMsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNkLGFBQVEsR0FBRyxFQUFFLENBQUM7SUFHckIsQ0FBQztJQUVNLCtCQUFNLEdBQWI7UUFFSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTthQUNwQixTQUFTLENBQUMsVUFBQyxNQUFNO1lBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNsQyxDQUFDLEVBQUUsVUFBQyxLQUFLO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbkMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFoQlEsY0FBYztRQU4xQixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE9BQU87WUFDakIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSxrQkFBa0I7WUFDL0IsU0FBUyxFQUFFLENBQUUsNEJBQVksQ0FBRTtTQUM5QixDQUFDO3lDQUtvQyw0QkFBWTtPQUpyQyxjQUFjLENBaUIxQjtJQUFELHFCQUFDO0NBQUEsQUFqQkQsSUFpQkM7QUFqQlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2VydmljZXMvbG9naW4uc2VydmljZVwiO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwibG9naW5cIixcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2xvZ2luVmlldy5odG1sXCIsXHJcbiAgICBwcm92aWRlcnM6IFsgTG9naW5TZXJ2aWNlIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIExvZ2luQ29tcG9uZW50IHtcclxuICAgIHB1YmxpYyB1c2VyTmFtZSA9IFwiXCI7XHJcbiAgICBwdWJsaWMgcGFzc1dvcmQgPSBcIlwiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9naW5TZXJ2aWNlOiBMb2dpblNlcnZpY2UpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VibWl0KCkge1xyXG5cclxuICAgICAgICB0aGlzLmxvZ2luU2VydmljZS5sb2dpbigpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XHJcbiAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=