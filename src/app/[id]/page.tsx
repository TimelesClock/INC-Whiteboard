import { TLDrawComponent } from "@/app/components/TLDrawComponent";
import { db } from "@/server/db";
import { type JsonObject } from "@tldraw/tldraw";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/server/auth"
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  //check if session.user.id has access to this whiteboard
  if (!session) {
    redirect("/login")
  }

  const userId = Math.random().toString(36).substring(7);
  const whiteboard = await db.whiteboard.findUnique({ where: { id: params.id } }) as unknown as JsonObject;
  if (!whiteboard) {
    return <div>Whiteboard not found</div>
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <TLDrawComponent roomId={params.id} userId={userId} whiteboard={whiteboard}/>
    </div>
  )
}
