import { TodoType } from "./store";
import { useGetStore } from "./useStore";

export const useActions = () => {
  const store = useGetStore();

  const createTodo = ({ text, type }: { text: string; type: TodoType }) => {
    const id = crypto.randomUUID();
    store.setRow("todos", id, {
      id,
      text,
      completed: false,
      createdAt: Date.now(),
      type,
    });
  };

  // Toggle todo completion
  const toggleTodo = (id: string) => {
    const todo = store.getRow("todos", id);
    if (todo) {
      store.setCell("todos", id, "completed", !todo.completed);
    }
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    store.delRow("todos", id);
  };

  return {
    createTodo,
    toggleTodo,
    deleteTodo,
  };
};
