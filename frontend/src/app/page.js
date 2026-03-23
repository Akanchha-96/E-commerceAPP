import { redirect } from "next/navigation";

export default function Home() {
  redirect("/register");
  // return <h2>Home Page Working </h2>;
}
