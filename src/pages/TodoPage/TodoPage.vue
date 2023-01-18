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
            <LoadingSpinner />
            <span>Loading Todos...</span>
          </template>
          <template v-else-if="!loadingTodos && todos.length">
            <TodoSection name="In Progress" />
            <draggable
              v-model="doingTodos"
              item-key="id"
              group="todos"
              @change="orderDoing"
            >
              <template #item="{ element }">
                <TodoItem :todo="element" @update-todo="updatedTodo" />
              </template>
            </draggable>
            <TodoSection name="Backlog" />
            <draggable
              v-model="backlogTodos"
              item-key="id"
              group="todos"
              @change="orderBack"
            >
              <template #item="{ element }">
                <TodoItem :todo="element" @updateTodo="updatedTodo" />
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
import LoadingSpinner from "../../components/LoadingSpinner.vue";
import TodoSection from "../../components/TodoSection.vue";

export default {
  components: {
    ErrorToast,
    TrashCan,
    TodoItem,
    draggable,
    LoadingSpinner,
    TodoSection,
  },
  data() {
    return {
      todos: [],
      loadingTodos: true,
      todoDescription: "",
      todoDate: new Date().toLocaleDateString("en-CA"),
      error: null,
      defaultError: "Something went wrong. Pls try again",
      todoColumns: ["description", "dueDate", "done", "priority"],
      drop: false,
      backlogTodos: [],
      doingTodos: [],
      dragging: false,
    };
  },
  watch: {
    error() {
      if (this.error) {
        setTimeout(() => (this.error = null), 3000);
      }
    },
    todos() {
      this.backlogTodos = this.todos.filter(
        (todo) => todo.section === "Backlog"
      );
      this.doingTodos = this.todos.filter(
        (todo) => todo.section === "InProgress"
      );
    },
  },
  created() {
    this.fetchTodos();
  },
  methods: {
    move(e) {
      console.log("move", e);
    },
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
          section: "Backlog",
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
        this.todos = this.todos.filter((todo) => todo.id != id);
        await todoService.deleteTodo(id);
        this.drop = false;
      } catch (error) {
        this.error = this.defaultError;
      }
    },
    updatedTodo(updatedTodo) {
      const index = this.todos.findIndex((todo) => todo.id === updatedTodo.id);
      if (index > -1) {
        const todos = this.todos.slice();
        this.todos = todos;
        this.todos[index] = updatedTodo;
      }
      console.log(this.todos);
    },
    handleDrop(event) {
      event.preventDefault();
      const id = event.dataTransfer.getData("todo");
      this.deleteTodo(id);
      // Do something with the data that was dropped into the trash can
    },
    async updateTodo(todo, fields, values) {
      try {
        const { id } = todo;
        let payload = { ...todo };
        fields?.forEach((field, index) => {
          payload[field] = values[index];
        });
        const updatedTodo = await todoService.updateTodo(id, payload);
      } catch (error) {
        console.log(error);
        this.error = this.defaultError;
      }
    },
    orderDoing(e) {
      this.order(e, "InProgress");
    },
    orderBack(e) {
      this.order(e, "Backlog");
    },
    order(e, section) {
      const action = Object.keys(e)[0];

      const { element: todo, newIndex } = e?.[action];
      switch (action) {
        case "removed":
          break;
        case "moved":
          this.updateTodo(todo, ["order"], [newIndex]);
          break;
        case "added":
          this.updateTodo(todo, ["order", "section"], [newIndex, section]);
          break;
      }
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
  grid-template-columns: 5fr 2fr 1fr 1fr;
  margin-top: 10px;
  margin-bottom: 10px;
}
.todo-table-body {
  height: 90%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}

div input[type="checkbox"] {
  padding: 0px;
  margin: 0px;
  cursor: pointer;
}

.icon:hover {
  transform: scale(1.3);
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.not-draggable {
  cursor: no-drop;
}
</style>
