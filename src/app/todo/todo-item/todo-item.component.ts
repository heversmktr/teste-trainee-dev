import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../shared/models/todo.model';
import { TodoService } from '../../shared/services/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() deletedTodo: EventEmitter<number> = new EventEmitter<number>();
  @Output() editTodo: EventEmitter<Todo> = new EventEmitter<Todo>();

  editThisTodo(): void {
  this.editTodo.emit(this.todo);
}

  constructor(private todoService: TodoService) {}

  deleteTodo(): void {
    if (confirm('Você tem certeza que quer deletar essa tarefa?')) {
      this.todoService.deleteTodo(this.todo.id);
    }
  }

  onTaskChecked(): void {
    this.todoService.updateTodo(this.todo);
  }
}
