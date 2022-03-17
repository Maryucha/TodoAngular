import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
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
  public todoList: Observable<Array<any>> | undefined;
  public lista: any[] = [];

  /**
   * This is the constructor of todoComponent
   * @param todoService 
   * @param formBuilder 
   * @param dialog 
   */
  constructor(
    private todoService: DataService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  /**
   * This method is responsable for init this component
   */
  async ngOnInit(): Promise<void> {
    this.formTodo = this.formBuilder.group({
      textControl: new FormControl('', [Validators.required, Validators.minLength(4)]),
      idControl: new FormControl(),
      completedControl: new FormControl(),
      updateControl: new FormControl(),
    });

    this.todoList = await this.todoService.getAllTodos();
    this.sortList();
  }

  /**
   * This method is called for resolved todo
   * @param todo 
   */
  toggleCompleted(id: string, todo: Todo) {
    todo.completed = !todo.completed;
    this.todoService.getOne(id).subscribe((a) => {
      todo =  a;
      todo.completed = !a.completed;
      todo.text = a.text;
      this.todoService.updateTodo(id, todo).subscribe((a) => {
        this.sortList();
      });
    });
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
   * This method is called for edited todo
   * @param todo 
   */
  public editTodo(todo: Todo) {
    let dialoRef = this.dialog.open(EditModalComponent, {
      height: '200px', width: '600px',
      data: todo
    })
    dialoRef.afterClosed().subscribe((a) => {
      todo = a;
      this.todoService.updateTodo(a.id, todo).subscribe((a) => {
        this.sortList();
      });
    });
  }

  /**
   * This method remove todo at list
   * @param id 
   */
  public deleteTodo(id: string) {
    this.todoService.getOne(id).subscribe((a) => {
      this.todoService.deleteTodo(id).subscribe(() => {
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