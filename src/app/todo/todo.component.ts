import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ArrayType, ResourceLoader } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponse } from '../model/auth-response.model';
import { Loading } from '../model/loading.model';
import { Todo } from '../model/todo';
import { User } from '../model/user.model';
import { AuthService } from '../service/auth.service';
import { TodoService } from '../service/todo.service';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  searchText:string;
  currentUser:User;
  isLoginMode=true;
  loginLoading=false;
  addLoading=false;
  getLoading=false;
  deleteLoading:Loading = new Loading();
  statusLoading:Loading = new Loading();
  editLoading:Loading = new Loading();
  editTodo= new Todo();
  todos: Todo[]=[];
  constructor(private todoService:TodoService,
    private authService:AuthService) { }

  ngOnInit() {
    this.currentUser=this.authService.getUserFromLocalStorage();
    this.getTodo();
  }
 

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    returnSecureToken: new FormControl(JSON.stringify(true))
  });
  todoForm = new FormGroup({
    newTodo: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(200),
    ]),
  });

  clearTodoForm() {
    this.todoForm.patchValue({
      newTodo: '',
    });
  }
  clearLoginForm() {
    this.loginForm.patchValue({
      email: '',
      password: '',
    });
  }
  bilgi(){
    console.log(this.authService.getUserFromLocalStorage())
  }
  onEditTodo(todo:Todo){
    if(this.editTodo.id==todo.id){
    this.editTodo= new Todo();
    }
    else{
      this.editTodo=todo;
    }
  }
  onLogin(){
    this.loginLoading=true;
      if(this.isLoginMode){

        this.authService.login(this.loginForm.value).subscribe(
          (response: HttpResponse<AuthResponse>) => {
            if (!response) {
              console.log("Something went wrong")
              this.loginLoading = false;    
            }
           
            else {
              
              this.authService.handleAuthentication(
                response.body.email,
                response.body.localId,
                response.body.idToken,
                response.body.expiresIn
                
              );
              console.log("başarılı giriş")
              this.loginLoading = false;
              window.location.reload();
    
            }
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse.message)
            this.loginLoading = false;
          }
        )
      }
      else{
    
        this.authService.register(this.loginForm.value).subscribe(
          (response:HttpResponse<AuthResponse> ) => {
            if (!response) {
              console.log("hata")
              this.loginLoading = false;
    
            }
            else {
              this.authService.handleAuthentication(
                response.body.email,
                response.body.localId,
                response.body.idToken,
                response.body.expiresIn
                
              );
              console.log(response.body.email)
              console.log("başarılı"+response)
              this.loginLoading = false;
    
            }
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse.message)
            this.loginLoading = false;
          }
        )
      }
      

  }
  
  addTodo(){
    this.addLoading=true;
  let newTodo = new Todo();
    newTodo.creator=this.currentUser.id;
    newTodo.status=true;
    newTodo.text=this.todoForm.value.newTodo;
      this.todoService.createTodo(newTodo).subscribe(
        (response: HttpResponse<Todo>) => {
          if (!response) {
            console.log("Something went wrong")
            this.addLoading = false;    
          }
          else {            
            this.getTodo();
            this.clearTodoForm();
            console.log("başarılı")
            this.addLoading = false;
  
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.message)
          this.addLoading = false;
        }
      )
    
  }
  deleteTodo(todo:Todo){

      this.deleteLoading.id=todo.id;
    this.deleteLoading.loading=true;
      this.todoService.deleteTodo(todo).subscribe(
        (response: any) => {   

            this.getTodo();
            console.log("başarılı")
            this.deleteLoading.id=null;
            this.deleteLoading.loading = false;
  
         
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.message)
          this.deleteLoading.loading = false;
        }
      )
    
  }
  changeStatus(todo:Todo){
    this.statusLoading.id=todo.id;
    this.statusLoading.loading=true;
    if(todo.status){
      todo.status=false;
    }
    else{
      todo.status=true;
    }
      this.todoService.changeStatus(todo).subscribe(
        (response: HttpResponse<Todo>) => {
          if (!response) {
            console.log("Something went wrong")
            this.statusLoading.loading=null;
            this.statusLoading.id=null;
          }
          else {            
            this.getTodo();
            console.log("başarılı")   
            this.statusLoading.loading=null;
            this.statusLoading.id=null;
  
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.message)
          this.statusLoading.loading=null;
          this.statusLoading.id=null;
        }
      )
    
  }
  updateTodo(){
    this.editLoading.id=this.editTodo.id;
    this.editLoading.loading=true;

    console.log(this.editTodo.text)    
      this.todoService.updateTodo(this.editTodo).subscribe(
        (response: HttpResponse<Todo>) => {
          if (!response) {
            console.log("Something went wrong")
            this.statusLoading.loading=null;
            this.statusLoading.id=null;
          }
          else {            
            this.getTodo();
            console.log("başarılı")   
            this.statusLoading.loading=null;
            this.statusLoading.id=null;
  
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.message)
          this.statusLoading.loading=null;
          this.statusLoading.id=null;
        }
      )
    
  }
  getTodo(){
  this.getLoading=true;
      this.todoService.getTodos(this.currentUser.id).subscribe(
        (response: Todo[]) => {
          if (!response) {
            console.log("Something went wrong")
            this.getLoading = false;    
          }
          else {            
           this.todos=response;
            console.log("başarılı")
            this.getLoading = false;
  
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.message)
          this.getLoading = false;
        }
      )
    
  }
  changeLoginMode(){
    if(this.isLoginMode){
      this.isLoginMode=false;
    }
    else{
      this.isLoginMode=true;
    }
  }
  isLoggedIn():boolean{
  return  this.authService.isLoggedIn();
  }
  onLogout():void{
    this.authService.logout();
    window.location.reload();
  }


}
