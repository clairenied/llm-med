import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DataImport from "@/components/DataImport";

export default async function ImportPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-8">
      <DataImport />
    </div>
  );
}
