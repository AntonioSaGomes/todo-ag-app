<template>
  <div>
    <div v-if="error" class="toast-error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: "ErrorToast",
  props: {
    error: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.toast-error {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 20px;
  background-color: #f44336;
  color: white;
  border-radius: 5px;
}
</style>
