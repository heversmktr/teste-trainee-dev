import { Component, OnInit } from '@angular/core';
import { Todo } from '../shared/models/todo.model';
import { TodoService } from '../shared/services/todo.service';

import { jsPDF } from 'jspdf';                // importa a extensão jspdf

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  todoToEdit?: Todo; // tarefa que será editada
  showCompletedTasks: boolean = false;               // Alterado boolean=true => boolean=false

  onEditTodo(todo: Todo) {
  this.todoToEdit = { ...todo }; // cria uma cópia da tarefa para edição
}


  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  addTodo(newTodoTitle: string) {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      title: newTodoTitle,
      completed: false
    };

    this.todoService.addTodo(newTodo);
  }

  updateTodo(updatedTodo: Todo) {
    this.todoService.updateTodo(updatedTodo);
  }

  deleteTodo(todoId: number) {
    this.todoService.deleteTodo(todoId);
  }

  clearAll() {
    if (this.todos.length > 0 && confirm('Você tem certeza que quer apagar todas as tarefas?')) {
      this.todoService.clearAll();
      this.loadTodos();
    }
  }

  clearCompletedTasks() {
    if (confirm("Tem certeza que deseja limpar as tarefas concluídas?")){       // Pergunta de confirmação adicionada
    this.todoService.clearCompletedTasks();
    this.loadTodos();
    }
  }

  toggleCompletedTasks() {                              
    this.showCompletedTasks = !this.showCompletedTasks;                     
    this.loadTodos();
    this.todos = this.filteredTodos();
  }

  filteredTodos() {
    return this.showCompletedTasks ? this.todos : this.todos.filter(todo => !todo.completed)  
  }

  get labelClearAll(){
    return 'Limpar Todas as Tarefas'            // Modificado o nome do botão Clear All -> Apagar Tudo
  }

  // feat: botão ordenar lista
  sortTodosByTitle(){
    this.todos.sort((a, b) => a.title.localeCompare(b.title));
  }

  // feat: exportar lista como PDF
  exportToPDF() {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Lista de Tarefas', 10, 10);

  let y = 20;

  this.todos.forEach((todo, index) => {
    const status = todo.completed ? '[X]' : '[ ]';
    const text = `${status} ${todo.title}`;

    doc.text(text, 10, y);
    y += 10;

    if (y > 280) { // quebra de página se ultrapassar o limite
      doc.addPage();
      y = 20;
    }
  });

  doc.save('lista-de-tarefas.pdf');
  }
}

