export const metadata = {
  title: "FAQ — Riveww",
  description: "Frequently asked questions about Riveww.",
};

const faqs = [
  {
    question: "What is Riveww?",
    answer:
      "Riveww is an AI-powered Google review tool that helps local businesses collect better customer feedback and convert it into review-ready drafts.",
  },
  {
    question: "How does Riveww work?",
    answer:
      "A customer scans your business QR code, selects a star rating, writes a few details, and Riveww generates multiple review draft options in your selected language and tone.",
  },
  {
    question: "Can I update keywords and business settings anytime?",
    answer:
      "Yes. You can edit your business profile, keywords, tone, and language from your dashboard at any time.",
  },
  {
    question: "Does the QR code store customer personal data?",
    answer:
      "No. The QR code only links to your public review page. It does not directly store customer personal information.",
  },
  {
    question: "How does payment upgrade work right now?",
    answer:
      "You can pay through the manual QR method and submit your details. The admin team verifies payment and activates your Pro plan manually.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-zinc-900">
          FAQ
        </h1>

        <div className="mt-8 divide-y divide-zinc-300 border-y border-zinc-300">
          {faqs.map((item) => (
            <details key={item.question} className="group py-5" open>
              <summary className="flex cursor-pointer list-none items-center justify-between text-left text-lg font-semibold text-zinc-900 sm:text-xl">
                <span className="pr-4">
                  {item.question}
                </span>
                <span className="text-xl text-zinc-500 transition group-open:rotate-180">
                  ^
                </span>
              </summary>
              <p className="mt-4 max-w-4xl text-base leading-7 text-zinc-700">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
