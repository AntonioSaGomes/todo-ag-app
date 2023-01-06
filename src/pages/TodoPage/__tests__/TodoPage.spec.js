import { describe, it, expect, vi, afterEach } from "vitest";
import TodoPage from "@/pages/TodoPage/TodoPage.vue";
import todoService from "../../../services/todo.service";
import { MOCK_TODOS } from "../../../test-data/test-data";
import { render, screen, waitFor, cleanup } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

let mockData = MOCK_TODOS[0];

describe("TodoPage.vue", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the page title", async () => {
    //Given
    render(TodoPage);

    //When & Then
    const pageTitle = screen.getByTestId("todo-header-text");
    expect(pageTitle.textContent).toBe("My Todos");
  });

  it("renders a new todo when the user types and presses enter", async () => {
    //Given
    render(TodoPage);
    const todoInput = screen.getByTestId("todo-input");

    const addTodoServiceSpy = vi.spyOn(todoService, "addTodo");
    addTodoServiceSpy.mockImplementationOnce(() => Promise.resolve(mockData));

    //When
    userEvent.type(todoInput, mockData.description);
    userEvent.keyboard("{enter}");

    //Then
    waitFor(() => {
      const todoRow = screen.findByTestId("todo-description");
      expect(addTodoServiceSpy).toHaveBeenCalledTimes(1);
      expect(todoRow.textContent).toContain("Test todo");
    });
  });

  it("updates a todo when the checkbox is clicked", async () => {
    //Given
    const getTodosServiceSpy = vi.spyOn(todoService, "getTodos");
    getTodosServiceSpy.mockImplementation(() => Promise.resolve([mockData]));
    const updateTodoServiceSpy = vi.spyOn(todoService, "updateTodo");
    const updatedMockData = { ...mockData, completed: true };
    updateTodoServiceSpy.mockImplementationOnce(() =>
      Promise.resolve(updatedMockData)
    );
    render(TodoPage);

    //When
    waitFor(() => {
      const checkbox = screen.getByTestId("input-checkbox");
      userEvent.click(checkbox);
    });

    //Then
    waitFor(() => {
      const todoRow = screen.findByTestId(".todo-description");
      expect(updateTodoServiceSpy).toHaveBeenCalledTimes(1);
      expect(todoRow.classes()).toContain("completed");
    });
  });

  it("deletes a todo when the delete button is clicked", async () => {
    //Given
    const deleteTodoServiceSpy = vi.spyOn(todoService, "deleteTodo");
    deleteTodoServiceSpy.mockImplementationOnce(() => Promise.resolve());
    render(TodoPage);

    //When
    waitFor(() => {
      const deleteButton = screen.getByTestId("remove-todo");
      userEvent.click(deleteButton);
    });

    //Then
    waitFor(() => {
      const todoRows = screen.findAllByTestId("todo-item");
      expect(deleteTodoServiceSpy).toHaveBeenCalledTimes(1);
      expect(todoRows.length).toBe(0);
    });
  });
});
