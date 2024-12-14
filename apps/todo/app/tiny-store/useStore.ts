import { UiReactWithSchemas as UIReact } from './store'


export const getStore = () => {
	const store = UIReact.useStore()

	if (!store) {
		throw Error("getStore needs to be used within a store")
	}

	return store
}