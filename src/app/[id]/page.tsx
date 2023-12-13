import { TLDrawComponent } from "@/app/_components/TLDraw";

export default async function Page({ params }: { params: { id: string } }) {

  const userId = Math.random().toString(36).substring(7);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <TLDrawComponent roomId={params.id} userId={userId}/>
    </div>
  )
}
