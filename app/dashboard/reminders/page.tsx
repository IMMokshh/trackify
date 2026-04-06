// Reminder feature has been disabled
// Redirect all visits to dashboard
import { redirect } from "next/navigation";

export default function RemindersPage() {
  redirect("/dashboard");
}
