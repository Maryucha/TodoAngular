import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {

  @Input() todo!: Todo;
  @Output() todoClicked: EventEmitter<void> = new EventEmitter();
  @Output() editClicked: EventEmitter<void> = new EventEmitter();
  @Output() removeClicked: EventEmitter<void> = new EventEmitter();

  public formTodo!: FormGroup;
  public todoList: Observable<Array<any>> | undefined;
  public lista: any[] = [];
  

  constructor(
    private todoService: DataService,
    private formBuilder: FormBuilder,
  ) { }

  /**
   * This method get list todo and create form
   */
  async ngOnInit() {

    this.formTodo = this.formBuilder.group({
      textControl: new FormControl('', [Validators.required, Validators.minLength(4)]),
      idControl: new FormControl(),
      completedControl: new FormControl(),
      updateControl: new FormControl(),
    })

    this.todoList = await this.todoService.getAllTodos();
    this.sortList();
  }

  onTodoClicked() {
    this.todoClicked.emit();
   
  }

  onEditTodoClicked() {
    this.editClicked.emit();
  }

  onRemoveTodoClicked() {
    this.removeClicked.emit();
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
