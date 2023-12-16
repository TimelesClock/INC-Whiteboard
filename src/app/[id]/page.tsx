import { TLDrawComponent } from "@/app/_components/TLDrawComponent";
import { db } from "@/server/db";
import { type JsonObject } from "@tldraw/tldraw";

export default async function Page({ params }: { params: { id: string } }) {

  const userId = Math.random().toString(36).substring(7);
  const whiteboard = await db.whiteboard.findUnique({ where: { id: params.id } }) as unknown as JsonObject;

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <TLDrawComponent roomId={params.id} userId={userId} whiteboard={whiteboard} />
    </div>
  )
}
