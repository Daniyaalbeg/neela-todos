import { createIndexes, createStore } from 'tinybase/with-schemas';
import { INITIAL_TODOS, TodosTableSchema, UiReactWithSchemas as UIReact, TodoValuesSchema } from './store'
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { useState } from 'react';

export const useCreateTodoStore = () => {
	const [isLoadingStore, setIsLoadingStore] = useState(true)
	const store = UIReact.useCreateStore(() => createStore().setTablesSchema(TodosTableSchema).setValuesSchema(TodoValuesSchema));

  UIReact.useCreatePersister(
    store,
		// @ts-expect-error
    (store) => createLocalPersister(store, 'todos/store'),
    [],
    async (persister) => {
      await persister.startAutoLoad([{
				todos: INITIAL_TODOS
			}, {
				selectedType: 'Now'
			}]);
      await persister.startAutoSave();
			setIsLoadingStore(false)
    },
  );

	const indexes = UIReact.useCreateIndexes(store, (store) =>
	  createIndexes(store).setIndexDefinition('types', 'todos', 'type'),
	);


	return {
		store, indexes,isLoadingStore
	}
}