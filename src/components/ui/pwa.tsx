import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

// Tambahkan deklarasi global untuk event khusus PWA
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
  }
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Handler sebelum banner install ditampilkan
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log("🔥 beforeinstallprompt fired");
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Handler kalau app sudah di-install
    const handleAppInstalled = () => {
      console.log("✅ PWA installed");
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Daftarkan listener
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Cek kalau app sudah dijalankan dari homescreen (standalone)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      // untuk Safari iOS
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    console.log("👍 User clicked install button");
    if (!deferredPrompt) return;

    console.log("👉 Prompting install");
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("🙌 User accepted install");
    } else {
      console.log("❌ User dismissed install");
    }

    // Event hanya bisa dipakai sekali
    setDeferredPrompt(null);
  };

  // Jangan render tombol kalau sudah terinstall atau event tidak tersedia
  if (isInstalled || !deferredPrompt) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <button
        onClick={handleInstall}
        className="px-2 py-1 bg-white font-crimson text-black shadow-lg text-sm tracking-wider hover:bg-gray-200 transition-all flex items-center gap-1 border border-transparent hover:border-black"
      >
        <ArrowDown strokeWidth={1} size={16} />
        <span>INSTALL APP</span>
      </button>
    </div>
  );
}
