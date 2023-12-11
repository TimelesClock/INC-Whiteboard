import { useEffect, useState, useMemo } from 'react'
import { io } from 'socket.io-client'
import {
    type HistoryEntry,
    type TLRecord,
    type TLStoreWithStatus,
    createTLStore,
    defaultShapeUtils,
} from '@tldraw/tldraw'

interface SocketIOStoreOptions {
    userId: string
    roomId: string
    server: string
}

export function useSocketIOStore({ userId, roomId, server }: SocketIOStoreOptions) {
    const [store] = useState(() => {
        const store = createTLStore({
            shapeUtils: [...defaultShapeUtils],
        })
        return store
    })

    const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
        status: 'loading',
    })

    const socket = useMemo(() => {
        return io(server, {
            query: { roomId, userId },
        })
    }, [server, roomId, userId])

    useEffect(() => {
        setStoreWithStatus({ status: 'loading' })

        const handleConnect = () => {
            // Join the room
            socket.emit('join-room', { roomId, userId });

            setStoreWithStatus({
                status: 'synced-remote',
                connectionStatus: 'online',
                store,
            })

            socket.on('update', handleUpdate)
        }

        const handleUpdate = (data) => {
            try {
                if (data.clientId === socket.id) return

                switch (data.type) {
                    case 'init':
                    case 'recovery':
                        store.loadSnapshot(data.snapshot)
                        break
                    case 'update':
                        store.mergeRemoteChanges(() => {
                            const { changes: { added, updated, removed } } = data.update as HistoryEntry<TLRecord>

                            for (const record of Object.values(added)) {
                                store.put([record])
                            }
                            for (const [, to] of Object.values(updated)) {
                                store.put([to])
                            }
                            for (const record of Object.values(removed)) {
                                store.remove([record.id])
                            }
                        })
                        break
                }
            } catch (e) {
                console.error(e)
            }
        }

        socket.on('connect', handleConnect)
        socket.on('disconnect', () => {
            setStoreWithStatus({
                status: 'synced-remote',
                connectionStatus: 'offline',
                store,
            })
        })

        store.listen((event) => {
            if (event.source !== 'user') return
            console.log(event.source)
            socket.emit('update', { clientId: socket.id, type: 'update', update: event, roomId })
        }, {
            source: 'user',
            scope: 'document',
        })

        return () => {
            socket.off('connect', handleConnect)
            socket.off('disconnect')
            socket.off('update', handleUpdate)
        }
    }, [socket, store])

    return storeWithStatus
}
