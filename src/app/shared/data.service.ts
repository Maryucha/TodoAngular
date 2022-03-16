import { Todo } from './todo.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


/**
 * This class is responsable for manager todo list
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {

  public endpoint = environment.url;
  public controller ='todos'
  constructor(private http: HttpClient) { }

  /**
   *  This method get list todo
   * @returns 
   */
 async getAllTodos() {
    return await this.http.get<Todo[]>(`${this.endpoint}/${this.controller}`);
  }

  /**
   * This method get one todo
   * @param id 
   * @returns 
   */
  getOne(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.endpoint}/${this.controller}/${id}`);
  }

  /**
   *  This method add one todo at list
   * @param todo 
   */
   addTodo(todo: Todo) {
    return this.http.post<Todo>(`${this.endpoint}/${this.controller}`,todo);
  }

  /**
   *  This method updated todo
   * @param id 
   * @param todo 
   */
  updateTodo(id: string, todo: Todo): Observable<Todo>{
   return this.http.patch<Todo>(`${this.endpoint}/${this.controller}/${id}`,todo);
  }

  /**
   * This method remove one todo
   * @param id 
   */
  deleteTodo(id: string) {
   return this.http.delete<Todo>(`${this.endpoint}/${this.controller}/${id}`);
  }
}
