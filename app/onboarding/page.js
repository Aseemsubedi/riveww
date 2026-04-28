import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (business) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10">
      <section className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Set up your business
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Add your business details once. We will use these settings whenever
          customers generate reviews.
        </p>
        <OnboardingForm />
      </section>
    </main>
  );
}
