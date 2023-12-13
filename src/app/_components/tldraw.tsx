"use client"

import { JsonObject, Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useSocketIOStore } from './useStore'
import { api } from '@/trpc/react'
import { toast } from 'react-hot-toast'


export function TLDrawComponent({ roomId, userId }: { userId: string, roomId: string }) {

	const {mutate: updateWhiteboard} = api.whiteboard.update.useMutation();

	const store = useSocketIOStore({
		userId: userId,
		roomId: roomId,
		server: 'http://localhost:3001',
	})

	const handleClick = () => {
		const snapshot = store?.store?.getSnapshot()
		updateWhiteboard({id: roomId, content:snapshot as unknown as JsonObject},{
			onSuccess: () => {
				toast.success("updateWhiteboard success")
				console.log(snapshot)
			},
			onError: (error) => {
				toast.error("updateWhiteboard error")
			}
		});
	}

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<div onClick={handleClick} className="cursor-pointer inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
				Save
			</div>
			<Tldraw store={store} />
		</div>
	)
}

