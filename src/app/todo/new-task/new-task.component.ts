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

    const titles = this.newTaskTitle.split('|').map(t => t.trim()).filter(t => t !== '');  // Divide a entrada em partes ao detectar um pipe '|'
                                                                                           // Remove espaços antes e depois e ignora partes vazias
    
    if (this.todoToEdit) {
      // Ajustando para considerar apenas uma tarefa no modo edição
    const updatedTodo: Todo = {
      ...this.todoToEdit,
      title: titles[0] // Pega apenas o primeiro item
    };
    this.todoService.updateTodo(updatedTodo);
    this.todoToEdit = undefined;

  } else {
    // Modo criação: adiciona várias tarefas
    titles.forEach(title => {
      const newTodo: Todo = {
        id: this.todoService.getTodoNewId(),
        title,
        completed: false
      };
      this.todoService.addTodo(newTodo);
    });
  }

  this.newTaskTitle = '';
  }
}