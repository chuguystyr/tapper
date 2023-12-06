'use client'
import { useRouter } from "next/navigation";
import Image from "next/image";
const Error = () => {
    const router = useRouter();
    return (
        <div className="px-5 flex flex-col gap-5 justify-center h-[100vh]">
            <Image src="/telegraph.png" width={150} height={150} alt="error" className="block mx-auto" />
            <h1 className="text-center text-2xl font-bold">Ooops! something went wrong...</h1>
            <p className="text-center text-lg">We're sorry for the trouble and already taking action.</p>
            <button type="button" className="btn" onClick={() => router.refresh()}>Refresh page</button>
        </div>
    )
}
export default Error;