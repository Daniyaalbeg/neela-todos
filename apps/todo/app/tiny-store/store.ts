import * as UiReact from "tinybase/ui-react/with-schemas";

import {
  createLocalPersister,
  createSessionPersister,
} from "tinybase/persisters/persister-browser";
import { createStore, TablesSchema, ValuesSchema } from "tinybase/with-schemas";

const id1 = crypto.randomUUID();
const id2 = crypto.randomUUID();
const id3 = crypto.randomUUID();

export const INITIAL_TODOS = {
  [id1]: {
    id: id1,
    text: "Start typing to create a new todo",
    completed: false,
    createdAt: Date.now(),
    type: "Now",
  },
  [id2]: {
    id: id2,
    text: "Click a todo to mark it complete",
    completed: false,
    createdAt: Date.now(),
    type: "Now",
  },
  [id3]: {
    id: id3,
    text: "Hover over a todo to delete it",
    completed: false,
    createdAt: Date.now(),
    type: "Now",
  },
};

export const TodoTypes = ["Now", "Later", "Future"];
export type TodoType = (typeof TodoTypes)[number];

// Define the schemas separately first
export const TodosTableSchema = {
  todos: {
    id: { type: "string" },
    text: { type: "string" },
    completed: { type: "boolean", default: false },
    createdAt: { type: "number" },
    type: { type: "string", default: "Now" },
  },
} as TablesSchema;

export const TodoValuesSchema = {
  selectedType: { type: "string" },
  // complete: {type: 'boolean', default: false},
} as ValuesSchema;

// Extract types for todos
export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

// Cast the whole module to be schema-based with WithSchemas:
export const UiReactWithSchemas = UiReact as UiReact.WithSchemas<
  [typeof TodosTableSchema, typeof TodoValuesSchema]
>;
