<template>
  <div class="todo-section">
    <span class="todo-section-name">{{ name }}</span>
  </div>
</template>

<script>
export default {
  props: { name: { type: String, required: true } },
  data() {
    return {};
  },
};
</script>

<style scoped>
.todo-section {
  background-color: whitesmoke;
  display: flex;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  justify-content: flex-start;
  width: 100%;
  outline: 2px solid silver;
}

.todo-section-name {
  font-size: 1rem;
  letter-spacing: 1px;
  padding-left: 1rem;
  text-shadow: 2px 2px 2px white;
  font-feature-settings: "liga" 1;
  color: black;
  font-weight: bold;
}
</style>
