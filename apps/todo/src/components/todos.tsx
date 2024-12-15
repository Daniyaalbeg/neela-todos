import { Loader2 } from "lucide-react";
import { UiReactWithSchemas } from "~/tiny-store/store";
import { TodoRow } from "./todo-row";
import { useEffect, useState } from "react";

export 
const Todos = ({ isLoadingStore }: { isLoadingStore: boolean }) => {
	const [selectedTodo, setSelectedTodo] = useState<string | null>(null)
  const currentType =
    UiReactWithSchemas.useValue("selectedType")?.toString() ?? "";
  const todos = UiReactWithSchemas.useSliceRowIds("types", currentType);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!todos.length) return;

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      setSelectedTodo(null);
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      
      const currentIndex = selectedTodo ? todos.indexOf(selectedTodo) : -1;
      let nextIndex;

      if (e.key === "ArrowUp") {
        nextIndex = currentIndex <= 0 ? todos.length - 1 : currentIndex - 1;
      } else {
        nextIndex = currentIndex >= todos.length - 1 ? 0 : currentIndex + 1;
      }

      setSelectedTodo(todos[nextIndex]);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [todos, selectedTodo]);

  if (isLoadingStore)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!todos.length)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-grow flex-col items-center justify-center gap-2">
          <p className="text-sm text-zinc-300">Start typing to add a task</p>
          <p className="text-xs text-zinc-500/80">
            Seriously just start typing...
          </p>
        </div>
      </div>
    );

  return (
    <div className="h-full w-full flex items-start justify-center">
      <div className="flex w-full flex-col items-center justify-start px-2 pt-2">
        <UiReactWithSchemas.SliceView
          indexId="types"
          sliceId={currentType}
          rowComponent={(props) => (
						<TodoRow {...props} selectedTodo={selectedTodo} setSelectedTodo={setSelectedTodo} />
					)}
        />
      </div>
    </div>
  );
};
