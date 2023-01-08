import axios from "axios";

//const BASE_URL = "https://todo-ag-api.herokuapp.com/";

const BASE_URL = "http://127.0.0.1:8000/";

const http = axios.create({
  baseURL: BASE_URL,
});

const getTodos = (params) => http.get("todos/", { params }).then((res) => res.data);

const addTodo = (data) => http.post("todos/", data).then((res) => res.data);

const updateTodo = (id, data) =>
  http.put(`/todo/${id}`, data).then((res) => res.data);

const deleteTodo = (id) => http.delete(`/todo/${id}`).then((res) => res.data);

export default {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
