import { Component } from '@angular/core';
import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { Todo } from '../../shared/models/todo.model';
import { TodoService } from 'src/app/shared/services/todo.service';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnChanges{
  @Input() todoToEdit?: Todo;

ngOnChanges(changes: SimpleChanges): void {
  if (changes['todoToEdit'] && this.todoToEdit) {
    this.newTaskTitle = this.todoToEdit.title;
  }
}

  newTaskTitle: string = '';

  constructor(private todoService: TodoService) { }


  addTask() {
    if (!this.newTaskTitle.trim()) return;     // Se o título for vazio não salva.
    
    if (this.todoToEdit) {
    const updatedTodo: Todo = {
      ...this.todoToEdit,
      title: this.newTaskTitle.trim()
    };

    const newTodo: Todo = {
      id: this.todoService.getTodoNewId(),
      title: this.newTaskTitle.trim(),          // Esse .trim() em title: this.newTaskTitle.trim() remove espaços extras no título
      completed: false
    };
    this.todoService.updateTodo(updatedTodo);
    this.todoToEdit = undefined;
   } else {
    const newTodo: Todo = {
      id: this.todoService.getTodoNewId(),
      title: this.newTaskTitle.trim(),
      completed: false
    };
    this.todoService.addTodo(newTodo);
  }

  this.newTaskTitle = '';
  }
}