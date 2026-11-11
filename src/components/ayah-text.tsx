import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { arNum, husaryUrl } from "@/lib/tajweed/audio";
import { clsx } from "clsx";

export function AyahText({ text, focus }: { text: string; focus?: string }) {
  if (!focus) return <p className="quran text-ink">{text}</p>;
  const at = text.indexOf(focus);
  if (at < 0) return <p className="quran text-ink">{text}</p>;
  return (
    <p className="quran text-ink">
      {text.slice(0, at)}
      <mark className="mark-noon">{focus}</mark>
      {text.slice(at + focus.length)}
    </p>
  );
}

export function AyahCaption({ surahName, ayah }: { surahName: string; ayah: number }) {
  return (
    <p className="text-sm text-muted">
      سورة {surahName} · الآية {arNum(ayah)} · حفص عن عاصم
    </p>
  );
}

export function ListenButton({
  surah,
  ayah,
  label = "تلاوة الحصري",
  onPlay,
  quiet = false,
  className,
}: {
  surah: number;
  ayah: number;
  label?: string;
  onPlay?: () => void;
  quiet?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = ref.current;
    setPlaying(false);
    setError(false);
    return () => el?.pause();
  }, [surah, ayah]);

  async function toggle() {
    const el = ref.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      setPlaying(false);
      return;
    }
    try {
      setError(false);
      await el.play();
      setPlaying(true);
      onPlay?.();
    } catch {
      setError(true);
      setPlaying(false);
    }
  }

  return (
    <div className="space-y-2">
      <audio
        ref={ref}
        src={husaryUrl(surah, ayah)}
        preload="none"
        onEnded={() => setPlaying(false)}
        onError={() => {
          setError(true);
          setPlaying(false);
        }}
      />
      <button
        type="button"
        onClick={toggle}
        className={clsx(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-emerald px-4 py-3 font-medium text-on-emerald hover:bg-emerald-deep",
          className,
        )}
      >
        <Volume2 className="h-5 w-5" aria-hidden />
        {playing ? "إيقاف التلاوة" : label}
      </button>
      {error ? (
        <p className="text-sm text-clay">تعذّر جلب التلاوة. الصوت تسجيل الشيخ الحصري ويحتاج إلى اتصال، ونونة لا تتلو الآية.</p>
      ) : quiet ? null : (
        <p className="text-sm text-muted">الشيخ محمود خليل الحصري · مرتّل · حفص. نونة تشرح ولا تتلو.</p>
      )}
    </div>
  );
}
