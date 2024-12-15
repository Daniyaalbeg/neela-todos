import { forwardRef, useReducer, useRef } from "react";
import { toast } from "sonner";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "./ui/context-menu";
import { motion , AnimatePresence } from 'framer-motion'
import { useReward } from "react-rewards";
import { CheckIcon, TrashIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { useIsMobile } from "~/hooks/useIsMobile";
import { Todo, UiReactWithSchemas as UIReact } from "../tiny-store/store";

type Props = typeof UIReact.RowProps & {
  selectedTodo: string | null
  setSelectedTodo: React.Dispatch<React.SetStateAction<string | null>>
}

type Actions =
  | "start-editing"
  | "update-input-value"
  | "stop-editing"
  | "check-double-clicking"
  | "double-click"
  | "update-todo-title";

type Action = {
  type: Actions;
  payload?: any;
};

const reducer = (state: typeof initalState, action: Action): State => {
  switch (action.type) {
    case "update-input-value":
      return {
        ...state,
        inputValue: action.payload,
      };
    case "start-editing":
      return {
        ...state,
        isDoubleClicking: false,
        isEditing: true,
      };
    case "stop-editing":
      return {
        ...state,
        isEditing: false,
        isDoubleClicking: false,
      };
    case "check-double-clicking":
      return {
        ...state,
        isDoubleClicking: true,
        timeoutId: action.payload,
      };
    case "double-click":
      if (state.timeoutId) clearTimeout(state.timeoutId);
      return {
        ...state,
        isDoubleClicking: false,
        timeoutId: null,
        isEditing: true,
      };
    default:
      return state;
  }
};

type State = {
  isDoubleClicking: boolean;
  isEditing: boolean;
  inputValue: string;
  timeoutId: NodeJS.Timeout | null;
};

const initalState: State = {
  isDoubleClicking: false,
  isEditing: false,
  inputValue: "",
  timeoutId: null,
};

export const TodoRow = forwardRef<HTMLDivElement, Props>(({
  tableId, rowId, selectedTodo
}, ref) => {
  const todo = UIReact.useRow(tableId, rowId) as Todo

  const inputRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer(reducer, {
    ...initalState,
    inputValue: todo.text ?? '',
  });
  const isMobile = useIsMobile();

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    if (state.isEditing) return;

    if (state.isDoubleClicking) {
      // Handle double click actio
      dispatch({
        type: "double-click",
      });

      if (inputRef.current) {
        const end = inputRef.current.value.length;
        inputRef.current.setSelectionRange(end, end);
        inputRef.current.focus();
      }
      return;
    }

    const timeout = setTimeout(() => {
      // Handle single click action
      if (isAnimating) return;
      onComplete();
      dispatch({
        type: "stop-editing",
      });
    }, 200);

    dispatch({
      type: "check-double-clicking",
      payload: timeout,
    });
  };

  const toggleTodo = UIReact.useSetCellCallback(tableId, rowId, 'completed', () => !todo.completed, [
    todo.completed,
  ]);

  const updateTodoText = UIReact.useSetCellCallback(tableId, rowId, 'text', (text: string) => text, [
    todo.text,
  ]);

  const deleteTodoText = UIReact.useDelRowCallback(tableId, rowId);

  const onComplete = () => {
    if (!todo.completed) {
      reward();
    }

    toggleTodo()
  };

  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const confirmDelete = confirm("Are you sure you want to delete this todo?");
    if (confirmDelete) {
      toast("Todo deleted");

      deleteTodoText()
    }
  };

  const moveTodoOnClick = async () => {
    // moveTodo({
    //   id: todo.id,
    //   timesMoved: todo.timesMoved + 1,
    //   type: isNow ? "later" : "today",
    // });
    // toast(`Moved to ${isNow ? "later" : "today"}`);
  };

  const { reward, isAnimating } = useReward(`rewardId-${rowId}`, "confetti", {
    spread: 90,
    elementSize: 4,
    elementCount: 20,
    startVelocity: 5,
    decay: 0.99,
  });

  return (
    <AnimatePresence mode="popLayout" key={rowId} initial={false}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <motion.div
            ref={ref}
            layout
            className="group relative z-10 h-12 w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileTap={{
              scale: state.isEditing ? 1.01 : 1.02,
              transition: { type: "spring", duration: 0.1 },
            }}
            whileHover={{ scale: 1.01, transition: { type: "spring" } }}
            onClick={onClick}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onComplete();
              }
            }}
            role="button"
            tabIndex={0}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: 0 * 0.01,
              // delay: i * 0.01,
              layout: {
                stiffness: 500,
                damping: 50,
                type: "spring",
              },
            }}
          >
            <div className={cn("absolute inset-0 z-[-1] rounded-lg focus:bg-zinc-600/50 group-hover:bg-zinc-600/50", selectedTodo === todo.id && "bg-zinc-600/50")} />
            <div
              key={todo.id}
              className="flex h-full w-full items-center justify-between px-2 sm:px-4"
            >
              <div className="relative flex h-12 flex-grow items-center justify-center gap-2">
                <span id={`rewardId-${rowId}`} />
                <div className="grid h-full w-8 flex-shrink-0 items-center justify-center">
                  <CheckIcon
                    className={cn('h-5 w-5',
                      todo.completed ? "" : "opacity-20",
                    )}
                  />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  onMouseDown={(e) => {
                    if (state.isEditing) return;
                    e.preventDefault();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      updateTodoText(e.currentTarget.value)
                      inputRef.current?.blur();
                    }
                  }}
                  onBlur={() => {
                    dispatch({
                      type: "stop-editing",
                    });
                  }}
                  contentEditable={state.isEditing}
                  className={cn(
                    "line-clamp-1 flex-grow cursor-pointer overflow-hidden text-ellipsis rounded-sm bg-transparent px-2 py-1 text-sm outline-none ring-zinc-300/20 focus:cursor-text focus-visible:ring-1",
                    { "line-through": todo.completed },
                  )}
                  value={state.inputValue}
                  onChange={(e) => {
                    dispatch({
                      type: "update-input-value",
                      payload: e.currentTarget.value,
                    });
                  }}
                />
              </div>
              <div>
                <button
                  className={cn(
                    "relative grid h-8 w-8 items-center justify-center rounded-sm opacity-0 hover:bg-zinc-600 focus:opacity-100 group-hover:opacity-100",
                    {
                      "opacity-100": isMobile,
                    },
                  )}
                  onClick={onDelete}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem inset asChild>
            <button
              className="h-full w-full text-start text-sm"
              onClick={() => {
                onComplete();
              }}
            >
              Mark as {todo.completed ? "incomplete" : "completed"}
            </button>
          </ContextMenuItem>
          <ContextMenuItem inset asChild>
            <button
              className="h-full w-full text-start text-sm"
              onClick={() => {
                dispatch({
                  type: "start-editing",
                });

                if (inputRef.current) {
                  const end = inputRef.current.value.length;
                  inputRef.current.setSelectionRange(end, end);
                  inputRef.current.focus();
                }
              }}
            >
              Rename
            </button>
          </ContextMenuItem>
          <ContextMenuItem inset asChild>
            <button
              className="h-full w-full text-start text-sm"
              onClick={moveTodoOnClick}
            >
              {/* {isNow ? "Move to later" : "Move to now"} */}
              {/* TODO  */}
              asd
            </button>
          </ContextMenuItem>
          <ContextMenuItem inset asChild>
            <button
              className="h-full w-full text-start text-sm text-red-700 hover:text-red-700"
              onClick={() => {
                const confirmDelete = confirm(
                  "Are you sure you want to delete this todo?",
                );
                if (confirmDelete) {
									// TODO
                }
              }}
            >
              Delete
            </button>
          </ContextMenuItem>
          {/* <ContextMenuSeparator /> */}
        </ContextMenuContent>
      </ContextMenu>
    </AnimatePresence>
  );
});

TodoRow.displayName = "TodoRow";
