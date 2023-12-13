"use client"

import { api } from "@/trpc/react";
import CreateWhiteboardModal from "@/app/_components/CreateWhiteboardModal";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DisplayWhiteboards() {
    const { data: whiteboards, isLoading } = api.whiteboard.getAll.useQuery();
    const [open, setOpen] = useState(false);
    const router = useRouter();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>
        <CreateWhiteboardModal open={open} setOpen={setOpen} />
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Whiteboards</h1>
            <button onClick={() => setOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Whiteboard
            </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
            {whiteboards?.map((whiteboard) => (
                <div key={whiteboard.id} onClick={() => router.push("/" + whiteboard.id.toString())} className="cursor-pointer border rounded shadow p-4">
                    <h2 className="font-bold text-lg">{whiteboard.name}</h2>
                </div>
            ))}
        </div>
    </>
}