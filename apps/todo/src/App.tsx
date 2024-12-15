import { TodoTypes, UiReactWithSchemas } from "~/tiny-store/store";
import { CommandMenuTodo } from "~/components/command-todo";
import { SonnerToast } from "~/components/toast";
import { useCreateTodoStore } from "~/tiny-store/useCreateStore";
import { cn } from "~/lib/utils";
import { useEffect } from "react";
import { Todos } from "~/components/todos";

export default function Index() {
  const { store, indexes, isLoadingStore } = useCreateTodoStore();

  return (
    <UiReactWithSchemas.Provider store={store} indexes={indexes}>
      <div className="flex h-screen w-full flex-col dark:bg-[#171717]">
        <div className="flex h-full w-full flex-grow flex-col items-center justify-center">
          <div className="-mx-2 pt-1 flex w-full flex-col max-w-[500px] max-h-[600px] h-[60%] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
            <Types />
            <Todos isLoadingStore={isLoadingStore} />
          </div>
        </div>
        <SonnerToast />
        <CommandMenuTodo />
      </div>
    </UiReactWithSchemas.Provider>
  );
}

const Types = () => {
  const currentType = UiReactWithSchemas.useValue(
    "selectedType"
  ) as (typeof TodoTypes)[number];

  const setSelectedType = UiReactWithSchemas.useSetValueCallback(
    "selectedType",
    (type: string) => type,
    []
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const currentIndex = TodoTypes.indexOf(currentType ?? "");
      let nextIndex;

      if (e.key === "ArrowLeft") {
        nextIndex =
          currentIndex === 0 ? TodoTypes.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === TodoTypes.length - 1 ? 0 : currentIndex + 1;
      }

      setSelectedType(TodoTypes[nextIndex]);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentType, handleKeyDown]);

  return (
    <ul className="flex gap-8 pb-2 justify-center mx-auto border border-x-0 border-t-0 border-stone-800/20 w-full">
      {TodoTypes.map((type) => (
        <Type key={type} type={type} />
      ))}
    </ul>
  );
};

const Type = ({ type }: { type: string }) => {
  const currentType = UiReactWithSchemas.useValue("selectedType");
  const handleClick = UiReactWithSchemas.useSetValueCallback(
    "selectedType",
    () => type,
    [type]
  );

  return (
    <li className={cn("", currentType === type && "bg-stone-300")}>
      <button onClick={handleClick}>{type}</button>
    </li>
  );
};
