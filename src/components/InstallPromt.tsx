"use client";

import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

/**
 * Helpers: tiny cookie utils (no external deps)
 */
function setCookie(name: string, value: string, days = 7) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${d.toUTCString()}; path=/; samesite=lax`;
}
function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
}

/**
 * Drawer styles: Tailwind bottom sheet
 */
const drawerPanelClasses =
  "fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-xl rounded-t-2xl bg-white shadow-2xl ring-1 ring-black/5";
const handleBarClasses = "mx-auto mt-2 h-1.5 w-12 rounded-full bg-gray-300";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [open, setOpen] = useState(false);
  const [readyForInstall, setReadyForInstall] = useState(false); // true when we caught beforeinstallprompt
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  const suppressionCookieName = "pwa_install_suppressed_until";
  const installedCookieName = "pwa_installed";

  const now = useMemo(() => new Date(), []); // stable reference

  // Determine platform + standalone
  useEffect(() => {
    const ua = navigator.userAgent;
    const isiOS =
      /iPad|iPhone|iPod/.test(ua) ||
      // iPadOS 13+ reports as Mac; check touch support
      (navigator.platform === "MacIntel" &&
        (navigator as any).maxTouchPoints > 1);
    setIsIOS(isiOS);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari specific
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
  }, []);

  // If installed, hide prompt forever (and set cookie)
  useEffect(() => {
    function onInstalled() {
      setIsStandalone(true);
      setOpen(false);
      setReadyForInstall(false);
      deferredPromptRef.current = null;
      setCookie(installedCookieName, "1", 365);
      deleteCookie(suppressionCookieName);
    }
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  // Respect previous install / suppression cookies
  useEffect(() => {
    const alreadyInstalled = getCookie(installedCookieName) === "1";
    if (alreadyInstalled) {
      setIsStandalone(true);
    }
  }, []);

  // Listen for beforeinstallprompt for non-iOS browsers
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setReadyForInstall(true);
      maybeOpenDrawer();
    };
    window.addEventListener("beforeinstallprompt", handler as any);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Decide to open drawer if:
  // - not standalone
  // - not suppressed by cookie
  // - either (a) iOS (show how-to) or (b) we have a deferred prompt (Android/desktop)
  const maybeOpenDrawer = () => {
    if (isStandalone) return;

    // suppression cookie stores a timestamp (ms). If in the future => suppressed.
    const sup = getCookie(suppressionCookieName);
    if (sup) {
      const ts = Number(sup);
      if (!Number.isNaN(ts) && now.getTime() < ts) {
        return; // still within suppression window
      }
    }

    if (isIOS || readyForInstall || deferredPromptRef.current) {
      setOpen(true);
    }
  };

  // Run once on mount to show iOS guidance if applicable
  useEffect(() => {
    // Don’t show immediately if installed already
    if (isStandalone) return;

    // For iOS, we won’t get the event; use guidance drawer
    if (isIOS) {
      maybeOpenDrawer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIOS, isStandalone]);

  // Actions
  const onInstallClick = async () => {
    const dp = deferredPromptRef.current;
    if (!dp) return;

    try {
      await dp.prompt();
      const choice = await dp.userChoice;
      if (choice.outcome === "accepted") {
        setOpen(false);
        // appinstalled event will handle cookie
      } else {
        // Dismissed—suppress for 7 days
        suppressForDays(7);
      }
    } catch {
      // If something goes wrong, don’t spam; suppress briefly
      suppressForDays(7);
    } finally {
      deferredPromptRef.current = null;
      setReadyForInstall(false);
    }
  };

  const suppressForDays = (days: number) => {
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).getTime();
    setCookie(suppressionCookieName, String(until), days);
    setOpen(false);
  };

  const onNotNow = () => suppressForDays(7);

  // Don’t render anything if installed
  if (isStandalone) return null;

  return (
    <>
      {/* Nothing visible unless the drawer is opened via logic above */}
      <Transition show={open} as={Fragment}>
        <Dialog onClose={onNotNow} className="relative z-50">
          {/* Backdrop */}
          <TransitionChild
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </TransitionChild>

          {/* Bottom Sheet */}
          <div className="fixed inset-0 flex items-end justify-center p-0">
            <TransitionChild
              as={Fragment}
              enter="transition transform ease-out duration-300"
              enterFrom="translate-y-full opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="transition transform ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-full opacity-0"
            >
              <DialogPanel className={drawerPanelClasses}>
                <div className={handleBarClasses} />

                <div className="px-5 pb-5 pt-3">
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    Install this app
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600">
                    Get quick access from your home screen and enjoy a faster,
                    more app-like experience.
                  </p>
                  {isIOS ? (
                    <div className="mt-4 space-y-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-gray-200">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 select-none">①</span>
                        <p>
                          Tap the <span className="font-medium">Share</span>{" "}
                          icon in Safari{" "}
                          <span role="img" aria-label="share icon">
                            ⎋
                          </span>
                          .
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 select-none">②</span>
                        <p>
                          Choose{" "}
                          <span className="font-medium">
                            Add to Home Screen
                          </span>{" "}
                          <span role="img" aria-label="plus">
                            ➕
                          </span>
                          .
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 select-none">③</span>
                        <p>
                          Confirm the name and tap{" "}
                          <span className="font-medium">Add</span>.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={onInstallClick}
                        disabled={
                          !readyForInstall && !deferredPromptRef.current
                        }
                        className="inline-flex w-full items-center justify-center rounded-xl border border-transparent bg-black px-4 py-2.5 text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        Add to Home Screen
                      </button>
                      <button
                        onClick={onNotNow}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-800 transition hover:bg-gray-50 sm:w-auto"
                      >
                        Not now
                      </button>
                    </div>
                  )}

                  {/* Tiny footnote */}
                  <p className="mt-4 text-xs text-gray-500">
                    You won&apos;t see this again for 7 days if you dismiss it.
                  </p>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
