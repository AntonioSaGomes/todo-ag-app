<template>
  <div
    class="trash-can"
    :class="{ 'trash-can--dragging': isDragging }"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
  >
    <img class="icon" src="/trash-can.svg" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDragging: false,
    };
  },
  methods: {
    handleDragEnter() {
      this.isDragging = true;
    },
    handleDragLeave() {
      console.log("this.handleDragLeave");
      this.isDragging = false;
    },
  },
};
</script>

<style>
.trash-can {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ffffff;
  transition: background-color 0.3s;
}

.icon {
  width: 2rem;
  height: 2rem;
}

.trash-can--dragging {
  background-color: #e74c3c;
}

.trash-can i {
  color: #cccccc;
  font-size: 24px;
}

.trash-can--dragging i {
  color: #ffffff;
}
</style>
