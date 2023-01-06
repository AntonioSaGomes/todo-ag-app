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
            @click="sortTodos(todoColumn)"
          >
            {{ todoColumn }}
            <img
              v-if="sortingOption === todoColumn"
              class="icon"
              src="../../assets/arrow-up-solid.svg"
            />
          </span>
        </div>
        <div class="todo-table-body">
          <template v-if="loadingTodos">
            <span>Loading Todos...</span>
          </template>
          <template v-else>
            <div
              class="todo-table-row"
              data-testid="todo-item"
              v-for="(todo, index) in todos"
              :key="todo.id"
            >
              <div class="todo-table-row-content">
                <div
                  class="todo-description"
                  data-testid="todo-description"
                  :class="[todo.completed ? 'completed' : '']"
                >
                  {{ todo.name }}
                </div>
                <div
                  class="todo-date"
                  :class="[todo.completed ? 'completed' : '']"
                >
                  {{ getDate(todo.dueDate) }}
                </div>
                <div class="todo-options">
                  <input
                    type="checkbox"
                    data-testid="input-checkbox"
                    @click="updateTodo(todo, index)"
                    :checked="todo.completed"
                  />
                </div>
                <img
                  class="icon"
                  src="../../assets/trash-solid.svg"
                  data-testid="remove-todo"
                  @click="deleteTodo(todo.id)"
                />
              </div>
            </div>
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
    <ErrorToast v-if="error" :error="error" />
  </div>
</template>
<script>
import todoService from "@/services/todo.service.js";
import ErrorToast from "@/components/ErrorToast.vue";

export default {
  components: { ErrorToast },
  data() {
    return {
      todos: [],
      loadingTodos: true,
      todoDescription: "",
      todoDate: new Date().toLocaleDateString("en-CA"),
      error: null,
      defaultError: "Something went wrong. Pls try again",
      sortingOption: "description",
      todoColumns: ["description", "dueDate", "completed"],
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
        await todoService.deleteTodo(id);
        this.todos = this.todos.filter((todo) => todo.id !== id);
      } catch (error) {
        this.error = this.defaultError;
      }
    },
    async updateTodo(todo, index) {
      try {
        const { completed, id } = todo;
        const payload = {
          ...todo,
          completed: !completed,
        };
        const updatedTodo = await todoService.updateTodo(id, payload);
        this.todos[index] = updatedTodo;
      } catch (error) {
        this.error = this.defaultError;
      }
    },
    getDate(date) {
      const today = new Date().getDate();
      const dateDay = parseInt(date?.split("-")[2]);
      return today === dateDay
        ? "Today"
        : today + 1 === dateDay
        ? "Tomorrow"
        : date;
    },
    sortTodos(sortKey) {
      this.sortingOption = sortKey;
      this.todos.sort((a, b) => {
        if (sortKey === "description") {
          return a[sortKey].localeCompare(b[sortKey]);
        } else if (sortKey === "completed") {
          return b[sortKey] - a[sortKey];
        } else if (sortKey === "dueDate") {
          const dateA = new Date(a[sortKey]);
          const dateB = new Date(b[sortKey]);
          return dateA - dateB;
        }
      });
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
  height: min(100%, 500px);
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

.completed {
  opacity: 0.4;
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

.todo-table-row-content {
  display: grid;
  text-align: left;
  grid-auto-flow: column;
  grid-template-columns: 4fr 3fr 2fr 1fr;
  cursor: pointer;
  align-items: center;
  padding: 10px 0px 10px;
}

.todo-table-row:hover {
  background-color: rgba(134, 208, 236, 0.3);
}

.todo-options {
  margin-left: 4.5ch;
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
