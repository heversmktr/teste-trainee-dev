import { Component } from '@angular/core';
import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { Todo } from '../../shared/models/todo.model';
import { TodoService } from 'src/app/shared/services/todo.service';
import { BAD_WORDS_PTBR } from 'src/app/shared/shared/bad-words-ptbr';

import { Filter } from 'bad-words';           // importa o filtro de palavras ofensivas; feat: bloqueador de palavras ofensivas

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnChanges{
  @Input() todoToEdit?: Todo;

  // feat: bloqueador de palavras ofensivas
  filter = new Filter();

ngOnChanges(changes: SimpleChanges): void {
  if (changes['todoToEdit'] && this.todoToEdit) {
    this.newTaskTitle = this.todoToEdit.title;
  }
  
}

  newTaskTitle: string = '';

  constructor(private todoService: TodoService) { 
    this.filter = new Filter();
    this.filter.addWords(...BAD_WORDS_PTBR);      // Adiciona lista brasileira de palavrões
  }


  addTask() {
    if (!this.newTaskTitle.trim()) return;     // Se o título for vazio não salva.

    const titles = this.newTaskTitle.split('|').map(t => t.trim()).filter(t => t !== '');  // Divide a entrada em partes ao detectar um pipe '|'
                                                                                           // Remove espaços antes e depois e ignora partes vazias
    
    if (this.todoToEdit) {
      // feat: bloqueado de palavras ofensivas
      const title = titles[0];
      if (this.filter.isProfane(title)){
        alert('A tarefa não foi salva por conter linguagem imprópria');
        return;
      }


    const updatedTodo: Todo = {
      ...this.todoToEdit,
      title: this.filter.clean(titles[0]) // Pega apenas o primeiro item, função this.filter.clean filtra a palavra ofensiva
    };
    this.todoService.updateTodo(updatedTodo);
    this.todoToEdit = undefined;
  } else {
    // Modo criação: adiciona várias tarefas
    titles.forEach(title => {
      if (this.filter.isProfane(title)) {
        alert(`A tarefa "${title}" contém linguagem inapropriada e foi ignorada.`);
        return; // pula para o próximo título
      }

    
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