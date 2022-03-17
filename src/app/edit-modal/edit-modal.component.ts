import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {

  public editFormTodo!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public todo: Todo
  ) { }

  ngOnInit(): void {
    this.editFormTodo = this.formBuilder.group({
      textControl: new FormControl(''),
      idControl: this.todo.id
    });
    this.editFormTodo.patchValue({
      textControl: this.todo.text,
      idControl: this.todo.id
    })

    console.log('id infeliz', this.todo.id);
  }

  onSubmit() {
    let todo: Todo = {
      text: this.editFormTodo.get('textControl')?.value,
      completed: false,
      id: this.todo.id
    }
    this.dialogRef.close(todo);
  }

}
