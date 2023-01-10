<template>
  <div
    class="todo-table-row"
    draggable
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    data-testid="todo-item"
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
      <div class="todo-date" :class="[todo.completed ? 'completed' : '']">
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
        class="icon clickable"
        @click.stop="changePriority(todo, index)"
        :src="`priority-${todo.priority}.svg`"
      />
    </div>
  </div>
</template>
<script>
import nextPriority from "../utils/nextPriority";
import todoService from "@/services/todo.service.js";

export default {
  emits: ["updateTodo"],
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleDragStart(event) {
      console.log("drag event start");
      console.log(this.todo.id);
      event.dataTransfer.setData("todo", this.todo.id);
    },
    handleDragEnd(event) {
      console.log("draggy event ended");
      // Do something when the drag operation is finished
    },
    async updateTodo(todo) {
      try {
        const { completed, id } = todo;
        const payload = {
          ...todo,
          completed: !completed,
        };
        const updatedTodo = await todoService.updateTodo(id, payload);
        this.$emit("updateTodo", updatedTodo);
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
    async changePriority(todo) {
      try {
        const { id } = todo;
        const priority = nextPriority(todo.priority);
        const payload = {
          ...todo,
          priority,
        };
        const updatedTodo = await todoService.updateTodo(id, payload);
        this.$emit("updateTodo", updatedTodo);
      } catch (error) {
        console.log(error);
        this.error = this.defaultError;
      }
    },
  },
};
</script>

<style scoped>
.todo-table-row-content {
  display: grid;
  text-align: left;
  grid-auto-flow: column;
  grid-template-columns: 5fr 2fr 1fr 1fr;
  cursor: pointer;
  align-items: center;
  padding: 10px;
}

.todo-table-row:hover {
  background-color: rgba(134, 208, 236, 0.3);
}

.todo-table-row {
  background: whitesmoke;
  outline: 2px solid silver;
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.todo-options {
  margin-left: 4.5ch;
}

.completed {
  opacity: 0.4;
}
</style>
