import { useEffect, useState } from 'react'

import useSocket from "@/app/utils/useSocket";
import {
    type HistoryEntry,
    type TLRecord,
    type TLStoreWithStatus,
    createTLStore,
    defaultShapeUtils,
    throttle,
    getUserPreferences,
    setUserPreferences,
    defaultUserPreferences,
    createPresenceStateDerivation,
    InstancePresenceRecordType,
    computed,
    react,
    type StoreSnapshot,
    type TLInstancePresence
} from '@tldraw/tldraw'

import { type JsonObject } from '@prisma/client/runtime/library'
import { type Socket } from "socket.io-client";

interface SocketIOStoreOptions {
    userId: string
    roomId: string
    userName: string
    server: string
    whiteboard: JsonObject | null
}

export function useSocketIOStore({ userId, userName, roomId, server, whiteboard }: SocketIOStoreOptions) {

    const [store] = useState(() => {
        const store = createTLStore({
            shapeUtils: [...defaultShapeUtils],
        })
        if (whiteboard && whiteboard.content && whiteboard.schema) {
            store.loadSnapshot(whiteboard.content as unknown as StoreSnapshot<TLRecord>)
        }
        return store
    })

    const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
        status: 'loading',
    })

    const [socket, setSocket] = useState<Socket | null>(null)
    useEffect(() => {
        const socket = useSocket(server, roomId, userId)
        setSocket(socket)
        return () => {
            socket?.disconnect()
        }
    }, [server, roomId, userId])


    useEffect(() => {

        if (!socket) return

        setUserPreferences({ id: userId, name: userName });

        const userPreferences = computed<{
            id: string;
            color: string;
            name: string;
        }>("userPreferences", () => {
            const user = getUserPreferences();
            return {
                id: user.id,
                color: user.color ?? defaultUserPreferences.color,
                name: user.name ?? defaultUserPreferences.name,
            };
        });

        const presenceId = InstancePresenceRecordType.createId(userId)
        const presenceDerivation = createPresenceStateDerivation(userPreferences, presenceId)(store)


        react('when presence changes', () => {
            const presence = presenceDerivation.value
            const presenceArray: TLInstancePresence[] = []
            requestAnimationFrame(() => {
                if (!presence) return
                presenceArray.push(presence)
                throttle(() => {
                    if (presenceArray.length === 0) return
                    socket.emit('presence', { roomId, userId, presence: presenceArray })
                    presenceArray.length = 0
                }, 50)()

            })
        })

        socket.on('presence', (data: { presence: TLRecord[] }) => {
            data.presence.forEach((data) => {
                store.mergeRemoteChanges(() => {
                    store.put([data])
                })
            })
        }
        )

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

        socket.on('test', (data: JsonObject) => {
            console.log(data)
        })

        const handleUpdate = (data: { clientId: string, update: HistoryEntry<TLRecord>[] }) => {
            try {
                if (data.clientId === socket.id) return;

                data.update.forEach((update: HistoryEntry<TLRecord>) => {
                    store.mergeRemoteChanges(() => {
                        const { changes: { added, updated, removed } } = update;
                        for (const record of Object.values(added)) {
                            store.put([record]);
                        }
                        for (const [, to] of Object.values(updated)) {
                            store.put([to]);
                        }
                        for (const record of Object.values(removed)) {
                            store.remove([record.id]);
                        }
                    });
                });

            } catch (e) {
                console.error(e);
            }
        };

        socket.on('connect', handleConnect)
        socket.on('disconnect', () => {
            setStoreWithStatus({
                status: 'synced-remote',
                connectionStatus: 'offline',
                store,
            })
        })

        const pendingChanges: HistoryEntry<TLRecord>[] = []
        const sendChanges = throttle(() => {
            if (pendingChanges.length === 0) return

            socket.emit('update', { clientId: socket.id, type: 'update', update: pendingChanges, roomId });


            pendingChanges.length = 0
        }, 50)

        store.listen((event) => {
            if (event.source !== 'user') return
            pendingChanges.push(event)
            sendChanges()
        }, {
            source: 'user',
            scope: 'document',
        })

        return () => {
            socket.off('connect', handleConnect)
            socket.off('disconnect')
            socket.off('update', handleUpdate)
            socket.off('presence')
        }
    }, [socket, store])

    return storeWithStatus
}
