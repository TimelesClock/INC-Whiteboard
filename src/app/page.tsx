import { TLDrawComponent } from "~/app/_components/tldraw";
export default async function Home() {

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <TLDrawComponent />
    </div>
  )
}
