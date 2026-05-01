import { redirect } from "next/navigation";

export default function IsAdminPage() {
  redirect("/admin");
}
