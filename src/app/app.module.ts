import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { TodoComponent } from './todo/todo.component';

@NgModule({
  declarations: [	
    AppComponent,
      TodoComponent
   ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    Ng2SearchPipeModule
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
