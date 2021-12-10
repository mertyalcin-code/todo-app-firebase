import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';

import { catchError, map, tap } from "rxjs/operators";
import { Todo } from '../model/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  url_firebase = "https://todo-app-c3710-default-rtdb.europe-west1.firebasedatabase.app/"
constructor(private http:HttpClient) { 

}
getTodos(userId:string): Observable<Todo[]> {
  return this.http.get<Todo[]>(this.url_firebase +userId+ '/todos.json').pipe(map(response => {
    const todos: Todo[] = [];

    for (const key in response) {
     todos.push({...response[key], id: key})
    }

    return todos;
  }),
    tap(data => console.log(data)),
    catchError(this.handleError),    
  );
}
createTodo(todo: Todo): Observable<HttpResponse<Todo>> {
  return this.http.post<Todo>(this.url_firebase +todo.creator+ '/todos.json', todo,{ observe: 'response' });
}
deleteTodo(todo: Todo): Observable<HttpResponse<any>> {
  return this.http.delete<any>(this.url_firebase +todo.creator+ '/todos/'+todo.id+'.json');
}
changeStatus(todo: Todo): Observable<HttpResponse<any>> {
  return this.http.put<any>(this.url_firebase +todo.creator+ '/todos/'+todo.id+'.json',todo);
}
updateTodo(todo: Todo): Observable<HttpResponse<any>> {
  return this.http.put<any>(this.url_firebase +todo.creator+ '/todos/'+todo.id+'.json',todo);
}

private handleError(error: HttpErrorResponse) {
  if(error.error instanceof ErrorEvent) {
    // client yada network
    console.log("error: " + error.error.message);
  } else {
    // backend
    switch(error.status) {
      case 404:
        console.log("not found");
        break;
      case 403:
        console.log("access denied");
        break;
      case 500:
        console.log("interval server");
        break;
      default:
        console.log("bilinmeyen bir hata");
    }
  }
  return throwError("bir hata oluştu.");
}
}
