
# Relatório Técnico - Heverson Morais

  

## 1. Visão Geral da Solução:

  

Primeiro, foram analisados e corrigidos os erros que impediam a aplicação de iniciar. Foi verificado que a aplicação se trata de um gerenciador de tarefas projetada para os colaboradores da empresa IMTS Group. Em seguida a lista de tarefas do QA foi analisada, com um total de 13 bugs a serem corrigidos e 6 features a serem inseridas a estratégia adotada consistiu em classificar os bugs por ordem de prioridade, foram elas: baixa, media, alta. Os bugs que foram classificados como alta prioridade de correção foram os que comprometiam o sistema imediatamente ou a curto prazo, por isso tiveram uma atenção especial. Por fim as features foram inseridas para garantir que a aplicação tenha novas funções, entre elas a de exportar PDF e filtro de conteúdo inapropriado.

  
  

---

  

## 2. Como Executar a Aplicação: Instruções claras para clonar, instalar e rodar o projeto (npm install, npm start).

  

Pré-requisitos: <br>

* Node.js (a partir da versão 16)

* gerenciador de pacotes NPM

  

Clone o repositório para sua máquina local:<br>

Abra um terminal e navegue até o diretório onde queira salvar o repositório e execute no termimal<br>

```bash

git  clone  https://github.com/heversmktr/teste-trainee-dev.git

```

  
  

Acesse o diretório do projeto a partir do terminal:<br>

```bash

cd  teste-trainee-dev

```

Instale as dependências do projeto:

```bash

npm  install

```

Comando para executar a aplicação:
```bash

npm  start

```
Uma série de erros irá impedir a aplicação de iniciar, iremos analisar e resolvê-las no tópico seguinte.


---

  

## 3. Correção dos erros iniciais. 


1° - Missing script "start".

Origem: `package.json`
Tipo: Erro tipográfico
Causa: Não há um script `start` no arquivo `package.json`

Solução: Inserir o script start no arquivo. Abrir o o arquivo `package.json` procurar pelo código abaixo e no final inserir `"start": "ng serve --open"`:
```json
"scripts": {
    "ng": "ng",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "start": "ng serve --open"
  },
```


2° - 'HeaderComponent' (imported as 'HeaderComponent') was not found

Origem: `src\app\layout\header\header.component.ts`
Tipo: Erro tipográfico
Causa: a classe estava sendo exportada com o nome “**HeadeComponent**” e importada com o nome “**HeaderComponent**”

Solução: Corrigir o error de digitação em `export class HeadeComponent implements OnInit`

```Typescript
import { Component, OnInit } from '@angular/core';

@component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {   constructor() { }

  ngOnInit(): void {
  }

}

// Error001: Digitação, "HeadeComponent" ao invés de "HeaderComponent"
```
3° - Erro de referência.

Origem: `src\app\todo\new-task\new-task.component.ts`
Tipo: Erro de referência
Causa: `new-task.component.ts` precisa do serviço TodoService para operar corretamente.

Solução: Importar o serviço: `import { TodoService } from 'src/app/shared/services/todo.service';` no início do arquivo `new-task.component.ts`: 
```Typescript
import { Component } from '@angular/core';
import { Todo } from '../../shared/models/todo.model';
import { TodoService } from 'src/app/shared/services/todo.service';

```

4° - The Component 'HeaderComponent' is declared by more than one NgModule.

Origem: `src\app\app.module.ts`
Tipo: Erro de referência
Causa: `HeaderComponent` está declarado **tanto no** `AppModule` **quanto no** `LayoutModule`, o que não é permitido.

Solução:  Apagar o HeaderComponent do campo declarations do @NgModule em `app.module.ts`


5° - Error: Can't resolve ‘node_modules/@fortawesome/fontawesome-free/css/all.min.css'

Origem: `node_modules`
Tipo: Erro de referência
Causa: O pacote de fontes @fortawasome-free não foi instalado.

Solução:  Instalar o pacote.
Abra o terminal e digite:
```bash
npm i --save @fortawesome/fontawesome-free
```
O pacote já fica registrado `package.json` como dependência.


---

  

## 4. **Relatório de Correção de Bugs:**

Os 13 bugs da lista do QA foram classificados de acordo com sua prioridade. Obedecendo a seguinte classificação: 

| Condição| Prioridade|
|---------|-----------|
|     Bugs que **corrompem dados** ou **impedem funcionalidades críticas**.    | Alta 🔴         |
|Bugs que **atrapalham fluxos** mas têm alternativas (ex: recarregar a página).|  Média 🟠
| Problemas **cosméticos** ou de **validação secundária**. | Baixa 🟡

 ### Bugs e correções:

1 - Ao clicar no botão “Salvar”, a tarefa está sendo adicionada duas vezes. - Alta 🔴

Causa: Chamada redundante em `src\app\todo\new-task\new-task.component.ts`
Solução: Remover chamada redundante.

```Typescript
this.todoService.addTodo(newTodo); 
// this.todoService.addTodo(newTodo);  // Segunda chamada redundante, deve ser removida this.newTaskTitle  =  '';
this.count++
```


2 - Só está sendo possível salvar uma tarefa a primeira vez que clica no botão “Salvar”, só é possível salvar uma nova tarefa após atualizar a página (F5) - Média 🟠

Causa:  Lógica antiga, cada vez que uma tarefa era adicionada o contador count=0 era incrementado, só que... se o contador é incrementado o if(this.count > 0) se torna verdadeiro e sai da função por causa do return.

Solução: remover `count=0`, `if(this.count > 0)` , `this.count++` de `src\app\todo\new-task\new-task.component.ts`.

  

3 -  O texto do botão de limpar todas as tarefas não está em português. Baixa 🟡

Causa:  `src\app\todo\todo.component.ts` texto em inglês hard-coded na função clearAll()

Solução: Traduzir o texto

4 - O botão “Exibir Tarefas Concluídas” está, na verdade, ocultando as tarefas concluídas. - Média 🟠

Causa: Erro de lógica em `src\app\todo\todo.component.ts` e ordem do texto do toggle-button no arquivo .html `src\app\todo\todo.component.html`

Solução: Em `src\app\todo\todo.component.ts` alterar o valor `boolean` de `true` para `false` em 
`showCompletedTasks: boolean = false; // Alterado boolean=true => boolean=false`
Em `todo.component.html` alterar a ordem do texto do toggle-button: 
De
```HTML
<button  class="toggle-button"  (click)="toggleCompletedTasks()">
{{  showCompletedTasks  ?  'Exibir Tarefas Concluídas'  :  'Ocultar Tarefas Concluídas'  }}
```
Para
```HTML
<button  class="toggle-button"  (click)="toggleCompletedTasks()">
{{  showCompletedTasks  ?  'Ocultar Tarefas Concluídas'  :  'Exibir Tarefas Concluídas'  }}
```
Essa solução também corrigi o quinto bug da lista. 

5 - O botão “Ocultar Tarefas Concluídas” tem o comportamento invertido, exibindo as tarefas concluídas. 

CORRIGIDO ANTERIORMENTE.

6 - Ao clicar em “Limpar Tarefas Concluídas”, a ação é executada sem pedir uma confirmação ao usuário.

Causa: Em `src\app\todo\todo.component.ts` não há uma função de confirmação.

Solução: Inserir função de confirmação:
ANTES:
```Typescript
clearCompletedTasks() {
    this.todoService.clearCompletedTasks();
    this.loadTodos();
  }
```
DEPOIS:
```Typescript
clearCompletedTasks() {
  if (confirm('Tem certeza que deseja limpar as tarefas concluídas?')) {
    this.todoService.clearCompletedTasks();
    this.loadTodos(); // Recarrega a lista atualizada
  }
}
```
7 - O botão “Limpar Tarefas Concluídas” está removendo as tarefas não concluídas em vez das concluídas.  Alta 🔴

Causa: 
Em  `this.todos = this.todos.filter(({ completed }) => completed === true);` o que a função está fazendo é apagar todos os itens que passaram pela função  `completed`.

```Typescript
  clearCompletedTasks() {
    this.todos = this.todos.filter(({ completed }) => completed === true);
    this.updateLocalStorageAndSave();
  }
}
```
Solução: 
```Typescript
clearCompletedTasks() {
  this.todos = this.todos.filter(todo => !todo.completed); // ✅ Correto (mantém NÃO concluídas)
  this.updateLocalStorageAndSave();
}
```
8 -  O botão “Editar” não está funcional. O comportamento esperado é: ao clicar, o campo “Título da Tarefa” deve ser preenchido com o texto da tarefa selecionada. Ao salvar, o item na lista deve ser atualizado e o campo de texto limpo. Média 🟠

Causa: Não havia uma rotina para fazer com que o botão Editar funcionasse. 

Solução: Criar uma rotina para fazer com que o botão funcionasse.

9 - O botão “Editar” está desalinhado e deve ser posicionado ao lado do botão “Remover”.  Baixa 🟡

Causa: Os dois botões, `Editar`, e `Remover` não estão dentro de um container HTML.

Solução: Inserir os botões em um container. Abrindo o arquivo `src\app\todo\todo-item\todo-item.component.html`
```HTML
<!-- Conteiner para os botões: -->
  <div class = "todo-item_actions">
   <button class="todo-item_edit">
     <i class="fas fa-edit fa-lg"></i> Editar
    </button>

    <button class="todo-item_delete" style="color: rgb(255, 0, 0)" (click)="deleteTodo()">      <!-- Cor alterada para vermelho -->
      <i class="fas fa-trash-alt fa-lg"></i> Remover
   </button>
  </div>
</div>
```
10 - O botão “Remover” deve ter a cor vermelha para indicar uma ação destrutiva. - Baixa 🟡 

Causa: Sem definição de cor no trecho de código correspondente.

Solução: Mudar a cor em `style` no trecho de código correspondente ao botão remover em `src\app\todo\todo-item\todo-item.component.html`

11 - A lista de tarefas não apresenta uma barra de rolagem quando o número de itens ultrapassa a altura do painel, impedindo a visualização de todas as tarefas. - Baixa 🟡

Causa: Não há container flexbox no arquivo `src\app\todo\todo.component.css`

Solução: Criando um container flexbox no arquivo `todo.component.css`

```CSS
.todo-list_container {

  /* configs da barra da lista */

  max-height: 400px;
  flex-grow: 1;
  overflow-y: auto; /* mantém somente esta linha */
  padding-right: 0.5rem;

  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #E9EDF7;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  height: 60vh;
  margin-top: 0.5rem;
  max-width: 51.5rem;
  padding: 2.5rem;
  width: 80vw;
}
```
12 - Salvar sem digitar um “Título da Tarefa” está adicionando um item em branco à lista. -  Alta 🔴

Causa: Ausência de função de validação para verificar se o título contém somente caracteres em branco. 

Solução: Em `src\app\todo\new-task\new-task.component.ts` inserir a função de verificação `if (!this.newTaskTitle.trim()) return;` em `addTask()` 

```Typescript
addTask() {

if (!this.newTaskTitle.trim()) return; // Se o título for vazio não salva.
```

13 - Digitar apenas espaços no campo “Título da Tarefa” e salvar também está adicionando um item em branco.   Média 🟠

Causa: Falta uma verificação na função `addTask()` para eliminar os caracteres em branco.

Solução: Usar a função .trim() nas entradas de texto.



## 5. **Relatório de Implementação de Melhorias**

  1 - Botão ordenar lista alfabeticamente de A-Z:
  Adicionei no dentro da classe do arquivo `todo.comoponent.ts` uma função de ordenação Bubble Sort onde cada elemento é comparado com todos os elementos da lista e movidos de lugar de acordo com o resultado da comparação, serve para organizar alfabeticamente os itens da lista.
```Typescript
// feat: botão ordenar lista
sortTodosByTitle(){
this.todos.sort((a, b) =>  a.title.localeCompare(b.title));
}
```

2 - Permitir que o usuário adicione uma tarefa pressionando a tecla Enter no campo de texto, além do clique no botão “Salvar”.

 No arquivo  `new-task.component.html` no campo <input> onde o usuário digita o nome da tarefa estava faltando adicionar um evento que permite que a tecla Enter seja pressionada para confirmar a tarefa.

```HTML
<input  
[(ngModel)]="newTaskTitle"  
placeholder="Título da Tarefa"  
(keydown.enter)="addTask()"  
/>
```

3 - Permitir a adição de múltiplas tarefas de uma só vez. O usuário deverá digitar os títulos separados pelo caractere | (pipe).

Para isso é preciso alterar a lógica da função addTask() em `new-task.components.ts`, a principal alteração é a inserção de uma função para separar os itens da string através do caractere pipe. 

4 - Implementar um filtro de palavras obscenas. Caso o usuário tente cadastrar uma tarefa contendo um palavrão, exiba a mensagem: “Não é permitido cadastrar tarefas com palavras obscenas.” (Sugestão de biblioteca: https://github.com/web-mech/badwords).

Para isso utilizei a biblioteca sugerida e criei o arquivo `src\app\shared\shared\bad-words-ptbr.ts` que contém palavras obscenas da língua portuguesa pois a biblioteca só trazia palavras em inglês, além disso o dicionário pode ser expandido. Também implementei uma função que bloqueia a criação de tarefas com nomes impróprios ao invés de substituí-los por *.

5- Adicionar a funcionalidade de exportar a lista de tarefas atual para um arquivo PDF. (Sugestão de biblioteca: https://github.com/parallax/jsPDF).

Primeiro foi instalado a biblioteca jdPDF. em seguida criado um método no componente `todo.component.ts` para gerar o PDF e por último um botão para `todo.component.html` para disparar essa funcionalidade.

6 - Substituir todos os alerts e confirms nativos do navegador por uma experiência mais moderna, utilizando a biblioteca SweetAlert. (Sugestão: https://sweetalert2.github.io/).

Ao tentar adicionar essa funcionalidade minha aplicação gerou conflitos, então ela não foi aplicada com sucesso. 

## 6. **Relatório de Débito Técnico:**

Não obtive sucesso ao tentar utilizar a biblioteca sweealert2, ela funcionou bem com alguns alertas, como mas gerou conflitos que me fizeram investir bastante tempo entendendo a lógica de como ela funcionava, guardei uma opção de solução de problema utilizando chamadas assíncronas, e continuo fazendo avanços para compreender onde foi que houve conflito com a opção "Limpar todas as tarefas" ocasionando uma interrupção da aplicação. 

Outra situação é que notei que eu podia ter expandido as opções de reordenação da lista, pensei em adicionar uma caixa de solução com as opções "Ordenar de A-Z"; Ordenar de Z-A"; "Mais recentes primeiro"; "Mais antigos primeiro"

Criar a funcionalidade do botão `Editar` exigiu que eu compreendesse um assunto abstrato envolvendo a interação dos módulos no Angular.

## 7. **Relatório de Melhorias:**

Funcionalidades: Registro de tarefas junto com a hora do sistema. Automação para exportar em PDF automaticamente toda a lista de tarefas do dia ao final de cada expediente e as guarda


## 8. **Decisões e Considerações:**
Minha maior dificuldade foi em entender o funcionamento da função Editar e aplicar isso sem prejuízo para o meu aprendizado.

  

---

  
