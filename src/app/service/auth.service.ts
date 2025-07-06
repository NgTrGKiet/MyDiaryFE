import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/User";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import { APIResponse } from "../models/APIResponse";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'https://localhost:7137/api/auth'

    constructor(private http: HttpClient) { }

    Login(user: User): Observable<APIResponse> {
        return this.http.post<APIResponse>(this.apiUrl + '/login', user).pipe(
            tap(response => {
                localStorage.setItem('token', response.result.accessToken)
                console.log(response.result.accessToken)
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error.error.errorMessages)
            })
        )
    }

    Register(user: User): Observable<APIResponse> {
        return this.http.post<APIResponse>(this.apiUrl + '/register', user).pipe(
            map((response: APIResponse) => {
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error.error.errorMessages);
            })
        )
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token;
    }

    logout() {
        localStorage.removeItem('token');
    }
}