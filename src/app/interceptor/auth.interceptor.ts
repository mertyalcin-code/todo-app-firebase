import { Injectable } from '@angular/core';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=`)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=`)) {
      return httpHandler.handle(httpRequest);
    }
  
    
    const token = this.authService.getUserFromLocalStorage().token;
    const request = httpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
    return httpHandler.handle(request);
  }
}
