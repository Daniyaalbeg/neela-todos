import { UiReactWithSchemas as UIReact } from "./store";

export const useGetStore = () => {
  const store = UIReact.useStore();

  if (!store) {
    throw Error("getStore needs to be used within a store");
  }

  return store;
};
