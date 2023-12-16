"use client"

import CreateWhiteboardModal from "@/app/_components/CreateWhiteboardModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {type JsonObject} from "@tldraw/tldraw";

export function DisplayWhiteboards({ whiteboards }: { whiteboards: JsonObject[]}) {

    const [open, setOpen] = useState(false);
    const router = useRouter();



    return <>
        <CreateWhiteboardModal open={open} setOpen={setOpen} />
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Whiteboards</h1>
            <button onClick={() => setOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Whiteboard
            </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
            {whiteboards?.map((whiteboard:JsonObject) => (
                <div key={whiteboard.id as string} onClick={() => router.push("/" + whiteboard.id?.toString())} className="cursor-pointer border rounded shadow p-4">
                    <h2 className="font-bold text-lg">{whiteboard.name as string}</h2>
                </div>
            ))}
        </div>
    </>
}