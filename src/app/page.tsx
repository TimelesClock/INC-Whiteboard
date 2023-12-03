import { TLDrawComponent } from "~/app/_components/tldraw";
import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <TLDrawComponent />
    </div>
  )
}
