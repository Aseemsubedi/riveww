export const metadata = {
  title: "Terms and Conditions — Riveww",
  description: "Terms and Conditions for using Riveww.",
};

export default function TermsPage() {
  const effectiveDate = "April 28, 2026";

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Terms and Conditions
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Effective Date: {effectiveDate}
        </p>

        <div className="mt-8 space-y-7 text-sm leading-7 text-zinc-700">
          <section>
            <h2 className="text-base font-semibold text-zinc-900">1. Introduction</h2>
            <p className="mt-2">
              These Terms and Conditions govern your use of Riveww. By using the
              Service, you agree to these Terms. If you do not agree, please do
              not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              2. Description of Service
            </h2>
            <p className="mt-2">
              Riveww helps businesses collect customer experience inputs and
              generate review draft suggestions for platforms like Google Reviews.
              Generated content is provided as assistance only; you are
              responsible for final review and posting decisions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              3. User Responsibilities
            </h2>
            <p className="mt-2">
              You agree to use Riveww lawfully and responsibly. You must not use
              the Service for spam, misleading content, impersonation, or illegal
              activity. You are responsible for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              4. AI-Generated Content
            </h2>
            <p className="mt-2">
              AI-generated review drafts may contain errors or unsuitable wording.
              You must review and edit content before use. Riveww does not
              guarantee platform acceptance, ranking improvements, or business
              outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              5. Plans, Billing, and Manual Approval
            </h2>
            <p className="mt-2">
              Riveww may offer free and paid plans. Paid upgrades may require
              manual verification and admin approval. Access to paid features
              begins only after successful approval.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              6. Availability and Changes
            </h2>
            <p className="mt-2">
              We may update, suspend, or discontinue features at any time. We may
              also update these Terms. Continued use after updates means you
              accept the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              7. Limitation of Liability
            </h2>
            <p className="mt-2">
              To the maximum extent allowed by law, Riveww is provided on an
              &quot;as is&quot; basis without warranties. We are not liable for
              indirect, incidental, or consequential losses arising from use of
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900">8. Termination</h2>
            <p className="mt-2">
              We may suspend or terminate access if these Terms are violated or
              where required for security, legal, or operational reasons.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              9. Governing Law
            </h2>
            <p className="mt-2">
              These Terms are governed by applicable laws of Nepal, unless
              otherwise required by law.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900">10. Contact</h2>
            <p className="mt-2">
              For questions about these Terms, contact us at{" "}
              <a
                href="mailto:hello@Riveww.com"
                className="font-medium text-blue-700 underline underline-offset-2"
              >
                hello@Riveww.com
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
