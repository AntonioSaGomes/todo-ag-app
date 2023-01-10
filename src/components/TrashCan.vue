<template>
  <div
    class="trash-can"
    :class="{ 'trash-can--dragging': isDragging }"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
  >
    <img
      class="trash-icon"
      :class="{ 'trash-icon--drop': drop }"
      :src="isDragging || drop ? 'red-trash-can.svg' : 'trash-can.svg'"
    />
  </div>
</template>

<script>
export default {
  props: {
    drop: { type: Boolean, default: false },
  },
  watch: {
    drop() {
      if (!this.drop) {
        this.isDragging = false;
      }
    },
  },
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

<style scoped>
.trash-can {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: background-color 0.3s;
}

.trash-icon {
  width: 4rem;
  height: 4rem;
}

.trash-icon--drop {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.trash-can i {
  color: #cccccc;
  font-size: 24px;
}

.trash-can--dragging i {
  color: #ffffff;
}
</style>
