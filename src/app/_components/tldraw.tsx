"use client"

import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import {useSocketIOStore} from './useStore'


export function TLDrawComponent({roomId,userId}: {userId: string, roomId: string}){


	const store = useSocketIOStore({
		userId: userId,
		roomId: roomId,
		server: 'http://localhost:3001',
	})

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw store={store}/>
		</div>
	)
}

