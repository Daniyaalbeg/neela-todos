import React, { useRef } from "react";

import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "~/hooks/useIsMobile";
import { CommandDialog, CommandInputWithoutSearch } from "./ui/command";
import { useActions } from "~/tiny-store/useActions";
import { TodoType, TodoTypes, UiReactWithSchemas } from "~/tiny-store/store";

const checkPressedKeys = (key: string, pressedKeys: Set<string>) => {
  if (key === "Enter") return true;

  const isAlphabet = /^[a-zA-Z]$/.test(key);
  const isNumber = /^[0-9]$/.test(key);

  const isValid = isAlphabet || isNumber;
  if (pressedKeys.has("Meta") && pressedKeys.has("k")) {
    return true;
  }

  if (isValid && pressedKeys.size === 1) {
    return true;
  }

  if (isValid && pressedKeys.size >= 2) {
    // If something is being held down while typing
    if (pressedKeys.has("Control") || pressedKeys.has("Shift")) {
      return true;
    }
  }

  return false;
};

export function CommandMenuTodo() {
  const { createTodo } = useActions()
  const [open, setOpen] = React.useState(false);
  const pressedKeys = useRef(new Set<string>());
  const isMobile = useIsMobile();
  const currentType = UiReactWithSchemas.useValue(
    "selectedType"
  ) as TodoType;

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Ignore enter for when submitting
      if (e.key === "Enter" && pressedKeys.current.size !== 0) return;
      if (e.key === "Enter") return;

      if (e.target instanceof HTMLInputElement) {
        // If typing in another input then don't open
        return;
      }
      pressedKeys.current.add(e.key);
      // TODO make this work with other languages
      if (checkPressedKeys(e.key, pressedKeys.current)) {
        setOpen(true);
      }
    };

    const up = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.key);
    };

    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
    };
  }, []);

  React.useEffect(() => {
    if (!open) {
      pressedKeys.current.clear();
    }
  }, [open]);

  const createNewTodo = async (description: string) => {
    setOpen(false);
    pressedKeys.current.clear();

    if (!description) return;

    createTodo({text: description, type: currentType})

    toast("Todo created");
  };

  const openTextMenu = () => {
    setOpen(true);
  };

  return (
    <>
      {isMobile ? (
        <div
          onClick={openTextMenu}
          className="fixed bottom-12 left-0 right-0 top-3/4 grid items-end justify-center"
        >
          <button
            onClick={openTextMenu}
            className="grid h-12 w-12 items-center justify-center rounded-full bg-zinc-300/50 outline-none"
          >
            <PlusIcon size={24} />
          </button>
        </div>
      ) : null}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInputWithoutSearch
          placeholder="Add a todo..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              createNewTodo(e.currentTarget.value);
              return;
            }
            if (e.key === "Backspace" && e.currentTarget.value === "") {
              setOpen(false);
              return;
            }
          }}
        />
        {/* <CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					<CommandItem>Create</CommandItem>
					<CommandItem>Search Emoji</CommandItem>
					<CommandItem>Calculator</CommandItem>
				</CommandGroup>
			</CommandList> */}
      </CommandDialog>
    </>
  );
}
