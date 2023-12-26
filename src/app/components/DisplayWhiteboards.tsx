"use client"

import CreateWhiteboardModal from "@/app/components/CreateWhiteboardModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { type JsonObject } from "@tldraw/tldraw";
import { Avatar } from "./ui/avatar";
import { Dropdown, DropdownItem, DropdownMenu } from '@/app/components/ui/dropdown'
import { MenuButton as HeadlessMenuButton } from '@headlessui/react'
import { signOut } from "next-auth/react"


export function DisplayWhiteboards({ whiteboards, avatar }: { whiteboards: JsonObject[], avatar: string }) {

    const [open, setOpen] = useState(false);
    const router = useRouter();


    return <>
        <CreateWhiteboardModal open={open} setOpen={setOpen} />



        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Whiteboards</h1>
            <div className="space-x-5">
                <button onClick={() => setOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Whiteboard
                </button>
                <Dropdown>
                    <HeadlessMenuButton>
                        <Avatar className="size-6" src={avatar} />
                    </HeadlessMenuButton>
                    <DropdownMenu>
                        <DropdownItem onClick={() => signOut()}>Sign Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

            </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
            {whiteboards?.map((whiteboard: JsonObject) => (
                <div key={whiteboard.id as string} onClick={() => router.push("/" + whiteboard.id?.toString())} className="cursor-pointer border rounded shadow p-4">
                    <h2 className="font-bold text-lg">{whiteboard.name as string}</h2>
                </div>
            ))}
        </div>
    </>
}