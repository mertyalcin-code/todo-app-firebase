import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthResponse } from '../model/auth-response.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { 

  }
  public register(form: FormData): Observable<HttpResponse<AuthResponse>> {

    return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+environment.api_key, form,{ observe: 'response' });
  }
  public login(form: FormData): Observable<HttpResponse<AuthResponse>> {
    
    return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+environment.api_key, form,{ observe: 'response' });
  }

  
  logout() {
    localStorage.removeItem("user");
    window.location.reload();
  }
  isLoggedIn():boolean{
    if(this.getUserFromLocalStorage()==null){
      return false;
    }
    else {return true}
  }
  getUserFromLocalStorage():User{
    const user:User = JSON.parse(localStorage.getItem("user"));
    if(user==null){
      return null;
    }
    if(user.tokenExpirationDate<(new Date())){      
      this.logout();  //çalışmıyor nedennnn
      return null;
    }    
    else{
      return user;
    }

  }
  handleAuthentication(email: string, userId: string, token: string, expiresIn: string) {
    const expirationDate:Date = new Date(new Date().getTime() - (parseInt(expiresIn) * 100000))
    const user = new User(    
    );
    user.email=email,
    user.id=userId,
    user.token=token,
    user.tokenExpirationDate=expirationDate 
    localStorage.setItem("user", JSON.stringify(user));
  }



}
