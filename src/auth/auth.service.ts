import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {

    signup(){
        return {message: "I am signup"};
    }

    signin(){
        return {message: "I am signin"};
    }

}