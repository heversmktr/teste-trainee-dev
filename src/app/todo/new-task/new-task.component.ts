import { Component } from '@angular/core';
import { Todo } from '../../shared/models/todo.model';
import { TodoService } from 'src/app/shared/services/todo.service';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent {
  newTaskTitle: string = '';

  constructor(private todoService: TodoService) { }


  addTask() {
    if (!this.newTaskTitle.trim()) return       // Se o título for vazio não salva.
    const newTodo: Todo = {
      id: this.todoService.getTodoNewId(),
      title: this.newTaskTitle.trim(),          // Esse .trim() em title: this.newTaskTitle.trim() remove espaços extras no título
      completed: false
    };

    this.todoService.addTodo(newTodo);
    this.newTaskTitle = '';                      
  }
}
