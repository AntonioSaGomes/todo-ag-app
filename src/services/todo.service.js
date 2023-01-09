import axios from 'redaxios';

//const BASE_URL = "https://todo-ag-api.herokuapp.com/";

const BASE_URL = "https://todo-ag-api.onrender.com";

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },

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
