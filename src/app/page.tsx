import { DisplayWhiteboards } from "@/app/components/DisplayWhiteboards";
import { db } from "@/server/db";
import { type JsonObject } from "@tldraw/tldraw";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/server/auth"
import { redirect } from "next/navigation"



const WhiteboardsPage = async () => {

  // const whiteboards = await db.whiteboard.findMany() as unknown as JsonObject[];
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }
  const userId = session.user.id
  let whiteboards = await db.whiteboardUsers.findMany({
    where: {
      userId
    },
    select: {
      whiteboard: true
    }
  }) as unknown as JsonObject[]

  whiteboards = whiteboards.map((whiteboard) => {
    return whiteboard.whiteboard as unknown as JsonObject
  }) as unknown as JsonObject[]

  return (
    <div className="container mx-auto p-4">
      <DisplayWhiteboards whiteboards={whiteboards} avatar={session.user.image!}/>
    </div>
  );
};

export default WhiteboardsPage;
