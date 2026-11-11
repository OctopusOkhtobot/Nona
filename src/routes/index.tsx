import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, House, MessageCircle, PenLine } from "lucide-react";
import { clsx } from "clsx";
import { HomeView } from "@/components/home-view";
import { MajlisView } from "@/components/majlis-view";
import { QuizView } from "@/components/quiz-view";
import { SharhView } from "@/components/sharh-view";
import type { GuideId } from "@/lib/tajweed/data";

export const Route = createFileRoute("/")({ component: MajlisApp });

type View = "home" | "sharh" | "quiz" | "majlis";

const nav: { id: View; label: string; icon: typeof House }[] = [
  { id: "home", label: "المجلس", icon: House },
  { id: "sharh", label: "الشرح", icon: BookOpen },
  { id: "quiz", label: "التدريب", icon: PenLine },
  { id: "majlis", label: "مع نونة", icon: MessageCircle },
];

function MajlisApp() {
  const [view, setView] = useState<View>("home");
  const [guideId, setGuideId] = useState<GuideId>("izhar");

  function openGuide(id: GuideId) {
    setGuideId(id);
    setView("sharh");
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-paper/90">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-gold">حفص عن عاصم · طريق الشاطبية</p>
            <p className="amiri text-3xl text-emerald-deep">نونة</p>
          </div>
          <Nav view={view} onChange={setView} className="hidden md:flex" />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10">
        {view === "home" ? <HomeView onOpen={setView} onGuide={openGuide} /> : null}
        {view === "sharh" ? <SharhView guideId={guideId} onGuide={openGuide} /> : null}
        {view === "quiz" ? <QuizView onMajlis={() => setView("majlis")} /> : null}
        {view === "majlis" ? <MajlisView /> : null}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur md:hidden">
        <Nav view={view} onChange={setView} className="grid grid-cols-4" />
      </nav>
    </div>
  );
}

function Nav({ view, onChange, className }: { view: View; onChange: (view: View) => void; className?: string }) {
  return (
    <div className={clsx("gap-1", className)}>
      {nav.map((item) => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={clsx(
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-3 py-2 text-sm font-medium",
              active ? "bg-emerald text-on-emerald" : "text-ink",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
