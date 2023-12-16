import { db } from "./src/server/db.js"

//findmany only return id and name
console.log(await db.whiteboard.findMany(
    {
        select: {
            id: true,
            name: true,
        }
    }
))

