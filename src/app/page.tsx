import { DisplayWhiteboards } from "./_components/DisplayWhiteboards";
import { db } from "@/server/db";
import {type JsonObject } from "@tldraw/tldraw";

const WhiteboardsPage = async() => {

  const whiteboards = await db.whiteboard.findMany() as unknown as JsonObject[];


  return (
    <div className="container mx-auto p-4">
      <DisplayWhiteboards whiteboards={whiteboards}/>
    </div>
  );
};

export default WhiteboardsPage;
