"use client"

import {
	type JsonObject,
	Tldraw,
	type TLUiOverrides,
	type TLUiTranslationKey,
	menuItem,
	findMenuItem,
} from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useSocketIOStore } from './useStore'
import { getAssetUrls } from '@tldraw/assets/selfHosted'

// import { api } from '@/trpc/react'
// import { toast } from 'react-hot-toast'

interface TLDrawComponentOptions {
	userId: string
	roomId: string
	whiteboard: JsonObject | null
}

export function TLDrawComponent({ roomId, userId, whiteboard }: TLDrawComponentOptions) {

	// const {mutate: updateWhiteboard} = api.whiteboard.update.useMutation();

	const assetUrls = getAssetUrls()


	const store = useSocketIOStore({
		userId: userId,
		userName: userId,
		roomId: roomId,
		server: process.env.NODE_ENV === "development" ? "http://localhost:3001" : process.env.NEXT_PUBLIC_SOCKET_URL!,
		whiteboard: whiteboard
	})

	// const handleClick = () => {
	// 	const snapshot = store?.store?.getSnapshot()
	// 	updateWhiteboard({id: roomId, content:snapshot as unknown as JsonObject},{
	// 		onSuccess: () => {
	// 			toast.success("updateWhiteboard success")
	// 			console.log(snapshot)
	// 		},
	// 		onError: (error) => {
	// 			toast.error("updateWhiteboard error")
	// 			console.log(error)
	// 		}
	// 	});
	// }

	const uiOverrides: TLUiOverrides = {
		actions(editor, actions) {
			// Create a new action or replace an existing one
			actions['invite-user'] = {
				id: 'invite-user',
				label: 'Invite new user' as TLUiTranslationKey,
				readonlyOk: true,
				onSelect() {
					window.alert('My new action just happened!')
				},
			}
			return actions
		},
		// contextMenu(editor, contextMenu, { actions }) {
		// 	const newMenuItem = menuItem(actions['my-new-action'])
		// 	const newMenuGroup = menuGroup('my-items', newMenuItem)
		// 	contextMenu.unshift(newMenuGroup)
		// 	return contextMenu
		// },
		menu(editor, menu, { actions }) {
			// using the findMenuItem helper
			const fileMenu = findMenuItem(menu, ['menu', 'file'])
			if (fileMenu.type === 'submenu') {
				// add the new item to the file menu's children
				const newMenuItem = menuItem(actions['invite-user']!)
				menu.unshift(newMenuItem)
			}
			return menu
		},
	}

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			{/* <div onClick={handleClick} className="cursor-pointer inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
				Save
			</div> */}
			<Tldraw store={store} assetUrls={assetUrls} overrides={uiOverrides} />
		</div>
	)
}

