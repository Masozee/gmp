// A simple redirect to the main home page
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/home");
}