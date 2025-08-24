import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserTask } from "../models/UserTask";
import { BehaviorSubject, Observable, catchError, map, throwError } from "rxjs";
import { APIResponse } from "../models/APIResponse";
import { DiaryDtos } from "../models/DiaryDto/Diary";
import { CreateDiaryDtos } from "../models/DiaryDto/CreateDiary";
import { UpdateDiaryDtos } from "../models/DiaryDto/UpdateDiary";

@Injectable({ providedIn: 'root' })
export class DiaryService {
    private apiUrl = 'https://localhost:7040/api/Diary'

    // private tasksSubject = new BehaviorSubject<UserTask[]>([]);
    // tasks$ = this.tasksSubject.asObservable();

    constructor(private http: HttpClient) { }

    private UserTask: UserTask[] = [];

    getDiaries(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.apiUrl + '/all-diaries?PageNumber=1&PageSize=10').pipe(
            map((response: APIResponse) => {
                response.result.items.forEach((diary: DiaryDtos) => {
                    diary.createdTime = this.formatDate(diary.createdTime);
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

    getDiary(id: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.apiUrl + '/' + id).pipe(
            map((response: APIResponse) => {
                response.result.createdTime = this.formatDate(response.result.createdTime);
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error.error.errorMessages);
            })
        )
    }

    createDiary(diary: CreateDiaryDtos): Observable<APIResponse> {
        return this.http.post<APIResponse>(this.apiUrl, diary).pipe(
            map((response: APIResponse) => {
                if (response.statusCode === 400) {
                }
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error.error.errorMessages);
            })
        )
    }

    updateDiary(diary: UpdateDiaryDtos): Observable<APIResponse> {
        return this.http.patch<APIResponse>(this.apiUrl, diary).pipe(
            map((response: APIResponse) => {
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                return throwError(error.error.errorMessages);
            })
        )
    }

    deleteDiary(id: string) {
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
        return `${day}-${month}-${year}`;
    }
}