"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";

export type FAQ = {
  question: string;
  answer: ReactNode;
  summary?: string;
};

export type FAQSection = {
  id: string;
  title: string;
  badge: string;
  description: string;
  faqs: FAQ[];
};

interface FAQExplorerProps {
  sections: FAQSection[];
}

export function FAQExplorer({ sections }: FAQExplorerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const questionContainerRef = useRef<HTMLDivElement | null>(null);

  const [activeSectionId, setActiveSectionId] = useState(() => {
    const requestedSection = searchParams?.get("topic");
    const isValidSection = sections.some((section) => section.id === requestedSection);

    if (requestedSection && isValidSection) {
      return requestedSection;
    }

    return sections[0]?.id ?? "";
  });

  const updateUrl = useCallback(
    (sectionId: string) => {
      if (typeof window === "undefined") {
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const defaultSectionId = sections[0]?.id ?? "";

      if (!sectionId || sectionId === defaultSectionId) {
        params.delete("topic");
      } else {
        params.set("topic", sectionId);
      }

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;

      window.history.replaceState(null, "", nextUrl);
    },
    [pathname, sections],
  );

  useEffect(() => {
    const isValidSection = sections.some((section) => section.id === activeSectionId);

    if (!isValidSection) {
      const fallbackSectionId = sections[0]?.id ?? "";
      setActiveSectionId(fallbackSectionId);
      updateUrl(fallbackSectionId);
    }
  }, [activeSectionId, sections, updateUrl]);

  const handleSectionSelect = useCallback(
    (sectionId: string) => {
      if (sectionId === activeSectionId) {
        return;
      }

      setActiveSectionId(sectionId);
      updateUrl(sectionId);

      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          questionContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    },
    [activeSectionId, updateUrl],
  );

  const currentSection = useMemo(
    () => sections.find((section) => section.id === activeSectionId) ?? sections[0],
    [activeSectionId, sections],
  );

  if (!currentSection) {
    return null;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold uppercase tracking-wider text-indigo-500">Explore topics</span>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to know about Eximso
          </h2>
          <p className="max-w-xl text-base text-slate-600">
            Switch between the topics below to find answers tailored for shoppers, logistics questions, payment clarity, and
            sellers scaling globally.
          </p>
        </div>
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {sections.map((section) => {
          const isActive = section.id === currentSection.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleSectionSelect(section.id)}
              className={clsx(
                "group relative flex min-w-[260px] snap-start flex-1 flex-col rounded-3xl border px-6 py-5 text-left transition-all duration-200",
                "lg:min-w-[220px] lg:flex-none",
                isActive
                  ? "border-indigo-500 bg-white shadow-2xl shadow-indigo-100"
                  : "border-slate-200 bg-white/70 backdrop-blur-sm hover:border-indigo-200 hover:shadow-lg",
              )}
            >
              <span
                className={clsx(
                  "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                  isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600",
                )}
              >
                {section.badge}
              </span>
              <span className="mt-3 text-lg font-semibold text-slate-900">{section.title}</span>
              <span className="mt-2 text-sm text-slate-600">{section.description}</span>
              <span
                className={clsx(
                  "pointer-events-none absolute inset-x-6 bottom-5 h-px origin-left scale-x-0 bg-indigo-500 transition-transform duration-200",
                  isActive ? "scale-x-100" : "",
                )}
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          ref={questionContainerRef}
          key={currentSection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-4"
        >
          {currentSection.faqs.map((faq, index) => (
            <Disclosure key={`${currentSection.id}-${index}`}>
              {({ open }) => (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm"
                >
                  <Disclosure.Button className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-slate-900">{faq.question}</p>
                      {faq.summary ? <p className="text-sm text-slate-500">{faq.summary}</p> : null}
                    </div>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-indigo-50 text-indigo-600"
                    >
                      <ChevronDown className="h-5 w-5" aria-hidden="true" />
                    </motion.span>
                  </Disclosure.Button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <Disclosure.Panel className="px-6 pb-6 text-base leading-relaxed text-slate-600">
                          {faq.answer}
                        </Disclosure.Panel>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              )}
            </Disclosure>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default FAQExplorer;
