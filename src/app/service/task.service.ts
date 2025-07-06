import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserTask } from "../models/UserTask";
import { BehaviorSubject, Observable, catchError, map, throwError } from "rxjs";
import { APIResponse } from "../models/APIResponse";

@Injectable({ providedIn: 'root' })
export class TaskService {
    private apiUrl = 'https://localhost:7137/api/usertask'

    // private tasksSubject = new BehaviorSubject<UserTask[]>([]);
    // tasks$ = this.tasksSubject.asObservable();

    constructor(private http: HttpClient) { }

    private UserTask: UserTask[] = [];

    getTasks(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.apiUrl + '/all-task').pipe(
            map((response: APIResponse) => {
                response.result.forEach((task: any) => {
                    task.start = this.formatDate(task.start);
                    task.end = this.formatDate(task.end);
                });
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error.error.errorMessages);
            })
        )
    }

    // loadTasks(): void {
    //     this.getTasks().subscribe(
    //         tasks => this.tasksSubject.next(tasks),
    //         error => console.error('Error loading tasks', error)
    //     );
    // }

    // refreshTasks(): void {
    //     this.loadTasks();
    // }

    getTask(id: number): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.apiUrl + '/single-task/' + id).pipe(
            map((response: APIResponse) => {
                response.result.start = this.formatDate(response.result.start);
                response.result.end = this.formatDate(response.result.end)
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error.error.errorMessages);
            })
        )
    }

    createTask(usertask: UserTask): Observable<APIResponse> {
        return this.http.post<APIResponse>(this.apiUrl, usertask).pipe(
            map((response: APIResponse) => {
                if (response.statusCode === 400) {
                    console.log(response.errorMessages);
                }
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error.error.errorMessages);
            })
        )
    }

    updateTask(id: number, usertask: UserTask): Observable<APIResponse> {
        return this.http.put<APIResponse>(this.apiUrl + '/' + id, usertask).pipe(
            map((response: APIResponse) => {
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                return throwError(error.error.errorMessages);
            })
        )
    }

    deleteTask(id: number) {
        return this.http.delete<APIResponse>(this.apiUrl + '/' + id).pipe(
            map((response: APIResponse) => {
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error.error.errorMessages);
            })
        )
    }

    private formatDate(isoDate: string): string {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${year}-${month}-${day}`;
    }
}