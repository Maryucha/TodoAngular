import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';

/**
 * This class represents todo components
 */
@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {

  public formTodo!: FormGroup;
  public tipo_template: boolean = false;
  public todoList: Observable<Array<any>> | undefined;
  public lista: any[] = [];
  public edit: boolean = false;
  public selected: boolean = false;

  constructor(
    private todoService: DataService,
    private formBuilder: FormBuilder,
  ) { }

  /**
   * This method get list todo and create form
   */
  async ngOnInit() {

    this.formTodo = this.formBuilder.group({
      textControl: new FormControl('', [Validators.required]),
      idControl: new FormControl(),
      completedControl: new FormControl(),
      updateControl: new FormControl(),
    })

    this.todoList = await this.todoService.getAllTodos();
    this.sortList();

  }
  /**
   * This method add one todo
   */
  public addTodo() {
    let todoCreate: Todo = {
      text: this.formTodo.get('textControl')?.value,
      completed: false,
    }
    if (this.formTodo.valid) {
      this.todoService.addTodo(todoCreate).subscribe((a) => { 
        this.sortList();
      });
      this.formTodo.reset();
      
    }
  }

  /**
   * This method updated todo
   * @param id 
   */
  public updateTodo(id: string) {
    this.tipo_template = true;
    this.todoService.getOne(id).subscribe((a) => {

      if (this.selected === false) {
        const todo: Todo = a;
        //abre o input
        this.edit = true;
        this.selected = true;
        this.formTodo.patchValue({
          updateControl: '',
        })
        //a.selected = true;
        if (this.formTodo.valid) {
          this.save(id);
          this.formTodo.reset();
          this.edit = false;
        }
      }
      this.sortList();
    });
  }

    /**
   * This method save one todo
   * @param id 
   */
     public save(id: string) {
      let current: Todo = {
        text: this.formTodo.get('updateControl')?.value,
      }
      this.todoService.updateTodo(id, current).subscribe((a) => {
        current=a
        
        this.sortList();
       });
    }

  /**
   * This method remove one todo
   * @param id 
   */
  public async deleteTodo(id: string) {
    await this.todoService.deleteTodo(id).subscribe((a) => { 
      this.sortList();
    });    
  }

  /**
   * Thise method resolve the tasks
   * @param id 
   */
  public resolveTodo(id: string) {
    this.todoService.getOne(id).subscribe((a) => {
      const todo: Todo = a;
      todo.completed = !a.completed;
      todo.text = a.text;
      this.todoService.updateTodo(id, todo).subscribe((a) => { 
        this.sortList();
      });
      
    });
  }

  /**
   * This method sorted list for completed param
   */
  public sortList() {
    this.todoList?.subscribe((a) => {
      this.lista = a;
      this.lista.sort(function (x, y) {
        return (x.completed - y.completed);
      });
    })
  }
}
