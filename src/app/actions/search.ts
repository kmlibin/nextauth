"use server";
import { redirect } from "next/navigation";

//redirecting user url for search bar
export async function search(formData: FormData) {
  const term = formData.get("term");
  if (typeof term !== "string" || !term) {
    redirect("/");
  }
  redirect(`/search?term=${term}`);
}
