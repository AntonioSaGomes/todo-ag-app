<template>
  <div class="todo-page-container overflow-y-hidden">
    <div class="todo-table overflow-y-hidden">
      <div class="todo-header">
        <h1 class="bold" data-testid="todo-header-text">My Todos</h1>
      </div>
      <div class="overflow-y-hidden" style="height: 90%">
        <div class="todo-table-header">
          <span
            v-for="todoColumn in todoColumns"
            class="clickable bold capitalize"
          >
            {{ todoColumn }}
          </span>
        </div>
        <div class="todo-table-body">
          <template v-if="loadingTodos">
            <span>Loading Todos...</span>
          </template>
          <template v-else>
            <draggable
              v-model="todos"
              tag="transition-group"
              :component-data="{ name: 'fade' }"
            >
              <template #item="{ element }">
                <TodoItem :todo="element" @update-todo="updateTodo" />
              </template>
            </draggable>
          </template>
        </div>
      </div>
    </div>
    <div class="add-todo-container">
      <input
        v-model="todoDescription"
        @keyup.enter="addTodo"
        placeholder="Add a todo -> Press Enter"
        data-testid="todo-input"
        class="todo-description-input"
      />
      <input v-model="todoDate" type="date" class="todo-date-input" />
    </div>
    <div
      class="trash-can-drop-zone"
      @dragover.prevent
      @dragenter.prevent
      @drop="handleDrop"
    >
      <TrashCan :drop="drop" />
    </div>
    <ErrorToast v-if="error" :error="error" />
  </div>
</template>
<script>
import todoService from "@/services/todo.service.js";
import ErrorToast from "@/components/ErrorToast.vue";
import TrashCan from "../../components/TrashCan.vue";
import TodoItem from "../../components/TodoItem.vue";
import draggable from "vuedraggable";

export default {
  components: { ErrorToast, TrashCan, TodoItem, draggable },
  data() {
    return {
      todos: [],
      loadingTodos: true,
      todoDescription: "",
      todoDate: new Date().toLocaleDateString("en-CA"),
      error: null,
      defaultError: "Something went wrong. Pls try again",
      todoColumns: ["description", "dueDate", "completed", "priority"],
      drop: false,
    };
  },
  watch: {
    error() {
      if (this.error) {
        setTimeout(() => (this.error = null), 3000);
      }
    },
  },
  created() {
    this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      try {
        this.todos = await todoService.getTodos();
      } catch (error) {
        this.error = this.defaultError;
      } finally {
        this.loadingTodos = false;
      }
    },
    async addTodo() {
      if (this.todoDescription.trim() == "") return;
      try {
        const payload = {
          name: this.todoDescription,
          priority: "high",
          completed: false,
          dueDate: this.todoDate,
        };
        const todo = await todoService.addTodo(payload);
        this.todos.push(todo);
        this.todoDescription = "";
      } catch (error) {
        this.error = this.defaultError;
      }
    },
    async deleteTodo(id) {
      try {
        this.drop = true;
        await todoService.deleteTodo(id);
        this.todos = this.todos.filter((todo) => todo.id != id);
        this.drop = false;
      } catch (error) {
        this.error = this.defaultError;
      }
    },
    updateTodo(updatedTodo) {
      const index = this.todos.findIndex((todo) => todo.id === updatedTodo.id);
      if (index > -1) this.todos[index] = updatedTodo;
    },
    handleDrop(event) {
      event.preventDefault();
      const id = event.dataTransfer.getData("todo");
      this.deleteTodo(id);
      // Do something with the data that was dropped into the trash can
    },
  },
};
</script>

<style scoped>
.todo-page-container {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: min(100%, 800px);
  max-height: 100vh;
  place-items: center;
}

.add-todo-container {
  display: flex;
  gap: 10px;
  width: 100%;
}

.todo-description-input {
  flex-basis: 70%;
}
.todo-header {
  margin: 10px;
}

input {
  padding: 12px;
  border: 1px solid #ccc;
  margin: 0 auto 15px;
}

.overflow-y-hidden {
  overflow-y: hidden;
}
.todo-table {
  width: 100%;
  padding: 25px;
}

.todo-table-header {
  display: grid;
  grid-auto-flow: column;
  text-align: left;
  grid-template-columns: 4fr 3fr 2fr 1fr;
  margin-top: 10px;
  margin-bottom: 10px;
}

.todo-table-body {
  height: 90%;
  max-height: 70%;
  overflow-y: scroll;
}

div input[type="checkbox"] {
  padding: 0px;
  margin: 0px;
  cursor: pointer;
}

.icon:hover {
  transform: scale(1.3);
}
</style>
