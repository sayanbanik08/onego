import { redirect } from "next/navigation";

export default function Home() {
    redirect("/login");
    //abhi to main redirect kar raha hoon login page pe temporarily... 
    // baad mai yaha par default banner aayega.
    //Load the red color page("Ongo") which is default at the first.
    //redirect("/login"); -> ye 5 sec ke baad redirect karega login page pe.
}

