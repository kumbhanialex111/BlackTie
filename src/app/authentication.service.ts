import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {
    public token: string;
 
    constructor(private http: HttpClient) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }
 
    login(email: string, password: string): Observable<boolean> {
        return this.http.post('http://13.127.205.70:8000/api/admin_login/', 
        { email: email, password: password })
            .map((response: Response) => {
                console.log('response',response);
                // login successful if there's a jwt token in the response
                let token = response["data"]["result"];
                if (token) {
                    // set token property
                    this.token = token;
                    console.log('token',token);
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: email, token: token }));
 
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }
    

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}