import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Globe2, Mail, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
import FAQExplorer, { type FAQSection } from "./faq-explorer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Eximso",
  description:
    "Get clear answers about shopping, shipping, payments, and selling with Eximso's cross-border marketplace.",
  openGraph: {
    title: "Frequently Asked Questions | Eximso",
    description:
      "Understand how Eximso simplifies global commerce with proxy export operations, smart logistics, and secure payments.",
    url: "https://www.eximso.com/faq",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Eximso – Global commerce made simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Eximso",
    description:
      "Answers for buyers and sellers using Eximso's cross-border marketplace, from logistics to payments.",
    images: ["/opengraph-image.png"],
  },
};

type SupportCard = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight: string;
};

const faqSections: FAQSection[] = [
  {
    id: "shopping",
    title: "Shopping on Eximso",
    badge: "For Buyers",
    description: "Discover how we curate Indian D2C brands and make them shoppable worldwide.",
    faqs: [
      {
        question: "What makes Eximso different from other cross-border marketplaces?",
        summary: "We combine curated brands with localized experiences for shoppers everywhere.",
        answer: (
          <>
            <p>
              Eximso was built to connect the world with India&apos;s most loved D2C brands. Our platform blends global marketplace
              access with localized languages, currencies, and experiences so you can shop seamlessly from anywhere.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Curated catalogues of fashion, wellness, beauty, lifestyle, and home décor labels.</li>
              <li>Localized interfaces that support multilingual browsing and multi-currency pricing.</li>
              <li>Smart logistics and secure payments that keep every order protected from checkout to delivery.</li>
            </ul>
          </>
        ),
      },
      {
        question: "How does Eximso ensure that the products I buy are authentic?",
        summary: "Every seller undergoes documentation, quality, and compliance checks before listing.",
        answer: (
          <>
            <p>
              Sellers must share GST certificates, banking details, catalog information, and category-level compliance before
              their products go live. Our onboarding and proxy-export operations verify authenticity and maintain traceability for
              each SKU, so you always receive genuine merchandise.
            </p>
          </>
        ),
      },
      {
        question: "Can I shop in my preferred currency and language?",
        summary: "Yes. The storefront adapts to local expectations so global customers feel at home.",
        answer: (
          <>
            <p>
              Eximso is designed to deliver a localized customer experience. The platform supports multi-currency payments and
              multilingual interfaces, helping you view prices transparently and check out without guesswork.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "logistics",
    title: "Shipping & Logistics",
    badge: "Delivery",
    description: "Understand how our smart logistics network keeps orders moving worldwide.",
    faqs: [
      {
        question: "How does international shipping with Eximso work?",
        summary: "We integrate with leading partners to manage door-to-door delivery in 100+ countries.",
        answer: (
          <>
            <p>
              From the moment your order is confirmed, Eximso coordinates with trusted logistics specialists to handle pickup,
              air and sea freight, and last-mile delivery. Our smart logistics integration keeps transit predictable and your
              parcels moving quickly across borders.
            </p>
          </>
        ),
      },
      {
        question: "Can I track my order after it leaves India?",
        summary: "Yes. You receive end-to-end tracking updates the moment we dispatch your parcel.",
        answer: (
          <>
            <p>
              Once your order is shipped, we send a tracking ID and live status updates straight to your inbox and Eximso
              account. You can monitor every milestone—from export clearance to delivery at your doorstep.
            </p>
          </>
        ),
      },
      {
        question: "How are customs duties, taxes, and returns handled?",
        summary: "We calculate duties upfront and support hassle-free returns in eligible categories.",
        answer: (
          <>
            <p>
              Applicable import duties and taxes are displayed during checkout so there are no surprises later. For eligible
              categories, our buyer-friendly cancellation and return policies let you raise a request directly from your account,
              and our support team coordinates the paperwork with local customs authorities.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & Pricing",
    badge: "Payments",
    description: "Find clarity on pricing, currencies, and refund timelines.",
    faqs: [
      {
        question: "Which payment methods does Eximso support?",
        summary: "Use international cards and region-specific payment options in multiple currencies.",
        answer: (
          <>
            <p>
              We accept international credit and debit cards alongside a growing roster of regional payment options. Every
              transaction is encrypted and backed by fraud monitoring so you can checkout with confidence.
            </p>
          </>
        ),
      },
      {
        question: "Are the prices I see inclusive of duties and taxes?",
        summary: "We surface shipping, duties, and taxes before you pay so costs stay transparent.",
        answer: (
          <>
            <p>
              Product prices, logistics fees, and estimated duties appear in your basket prior to payment. In markets where
              customs requires an additional settlement, we explain the amount and the authority that will collect it during
              delivery.
            </p>
          </>
        ),
      },
      {
        question: "How do refunds work for international orders?",
        summary: "Refunds are processed after inspection and returned to your original payment method.",
        answer: (
          <>
            <p>
              Once a return is approved and the product reaches our fulfilment hub, we initiate the refund to your original
              payment method. You&apos;ll receive confirmation emails at each step, and settlement times depend on your bank or
              payment provider.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "selling",
    title: "Selling with Eximso",
    badge: "For Sellers",
    description: "Unlock the proxy-export infrastructure built for Indian manufacturers and D2C brands.",
    faqs: [
      {
        question: "Who can sell on Eximso and what documents are required?",
        summary: "Manufacturers, MSMEs, and D2C labels with export capability can apply with core paperwork.",
        answer: (
          <>
            <p>
              If you&apos;re an Indian business with GST registration and a product catalogue, you can apply to join Eximso. We
              ask for GST details, bank information, and product data during onboarding so we can authenticate your business and
              share your catalogue with global buyers.
            </p>
          </>
        ),
      },
      {
        question: "What is proxy export and how does Eximso manage it for sellers?",
        summary: "We take care of export documentation, customs, and shipping labels on your behalf.",
        answer: (
          <>
            <p>
              Eximso&apos;s proxy-export model lets you focus on manufacturing while we prepare invoices, compliance documents,
              customs filings, and freight handovers. That means faster go-to-market cycles without building your own export team.
            </p>
          </>
        ),
      },
      {
        question: "Can I handle both B2C and B2B orders through the same dashboard?",
        summary: "Yes. Manage consumer parcels and bulk shipments with unified analytics and payouts.",
        answer: (
          <>
            <p>
              Your seller dashboard supports retail-ready listings and bulk procurement requests simultaneously. Real-time
              analytics, payout tracking, and dedicated account managers help you scale globally without juggling multiple tools.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "support",
    title: "Growth & Support",
    badge: "Assistance",
    description: "Learn how we champion sustainable, customer-centric commerce for every partner.",
    faqs: [
      {
        question: "What kind of business insights does Eximso provide to sellers?",
        summary: "Leverage technology-driven dashboards to monitor demand, pricing, and fulfilment.",
        answer: (
          <>
            <p>
              Our technology stack surfaces analytics on shopper demand, regional pricing windows, logistics status, and repeat
              behaviour. These insights help you optimise inventory, product-market fit, and marketing investments across
              territories.
            </p>
          </>
        ),
      },
      {
        question: "How does Eximso maintain customer trust across regions?",
        summary: "Buyer protection combines secure payments, responsive support, and easy returns.",
        answer: (
          <>
            <p>
              Secure cross-border payments, buyer protection policies, and responsive service are core to our promise. Dedicated
              support specialists assist with escalations, while our sustainability commitments keep packaging and logistics
              practices responsible.
            </p>
          </>
        ),
      },
      {
        question: "Who can I contact if I need tailored assistance?",
        summary: "Reach our specialists via email, phone, or live chat for immediate help.",
        answer: (
          <>
            <p>
              Whether you&apos;re troubleshooting an order or planning expansion, our customer success team is a call or message
              away. We&apos;ll connect you with the right expert—logistics, payments, or product—to resolve your request quickly.
            </p>
          </>
        ),
      },
    ],
  },
];

const supportCards: SupportCard[] = [
  {
    icon: Mail,
    title: "Email our specialists",
    description: "contact@eximso.com",
    highlight: "We respond within one business day for most queries.",
  },
  {
    icon: Phone,
    title: "Call the support desk",
    description: "+91 90378 50541",
    highlight: "We provide 24/7 support, 365 days a year.",
  },
  {
    icon: MessageCircle,
    title: "Start a live chat",
    description: "Sign in to chat with our global support agents.",
    highlight: "Ideal for quick updates on orders, payouts, or onboarding.",
  },
];

export default function FAQsPage() {
  return (
    <div className="bg-gradient-to-b from-indigo-50/70 via-white to-white text-slate-900">
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-sky-500/30 blur-3xl"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Frequently Asked Questions
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Cross-border commerce, explained simply
              </h1>
              <p className="text-lg text-slate-600">
                Explore how Eximso&apos;s proxy-export model, smart logistics network, and secure payment stack turn international
                shopping into an easy, trustworthy experience for buyers and sellers alike.
              </p>
              <ul className="grid gap-3 pt-4 text-sm font-medium text-slate-700 sm:grid-cols-2">
                <li className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-indigo-600" aria-hidden="true" />
                  Buyer protection, encrypted payments, and responsive service.
                </li>
                <li className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                  <Globe2 className="mt-0.5 h-5 w-5 text-indigo-600" aria-hidden="true" />
                  Smart logistics for 100+ countries with customs-ready paperwork.
                </li>
                <li className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                  <Sparkles className="mt-0.5 h-5 w-5 text-indigo-600" aria-hidden="true" />
                  Curated Indian D2C brands brought to global audiences.
                </li>
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 p-8 shadow-xl shadow-indigo-100 backdrop-blur">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-900">Why this FAQ exists</h2>
                <p className="text-base text-slate-600">
                  We analysed our About Us, Mission &amp; Vision, seller onboarding, logistics, and policy content to highlight
                  the questions buyers and sellers ask most while navigating cross-border trade with Eximso.
                </p>
                <p className="text-base text-slate-600">
                  Use the interactive explorer below to drill into shoppers, logistics, payments, seller operations, and growth
                  topics—each with concise, animated answers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FAQExplorer sections={faqSections} />
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 rounded-4xl border border-indigo-100 bg-white/80 p-8 shadow-2xl shadow-indigo-100 backdrop-blur-lg lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:p-12">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1 text-sm font-semibold text-indigo-700">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Need more help?
              </span>
              <h2 className="text-3xl font-bold text-slate-900">Still have a question for Eximso?</h2>
              <p className="text-base text-slate-600">
                Our global support specialists are ready to guide you—whether you&apos;re tracking an order, planning your export
                roadmap, or tailoring a launch campaign for a new market.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {supportCards.map((card) => (
                <div
                  key={card.title}
                  className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="space-y-3">
                    <card.icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                    <p className="text-base text-indigo-700">{card.description}</p>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">{card.highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
