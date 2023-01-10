<script setup>
import TodoPage from "./pages/TodoPage/TodoPage.vue";
</script>

<template>
  <div class="todo-page-wrapper">
    <img class="todo-person-image" src="todo-backy.png" />
    <TodoPage />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}
.todo-page-wrapper {
  position: relative;
  display: grid;
  place-items: center;
  height: 100%;
  width: 100%;
}
.todo-person-image {
  position: absolute;
  bottom: 0px;
  left: 5px;
  width: 15%;
}
</style>
