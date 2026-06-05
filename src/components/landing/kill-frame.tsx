"use client";

import { Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";

/* ── data ── */
const LINES = [
  {
    time: "12:04:31",
    label: "agent.task",
    text: '"reconcile vendor invoices"',
  },
  {
    time: "12:04:32",
    label: "tool.call",
    text: 'crm.read(account="acme")',
    allowed: true,
  },
  {
    time: "12:04:33",
    label: "tool.call",
    text: 'files.read("contracts/acme.pdf")',
    allowed: true,
  },
  {
    time: "12:04:35",
    label: "tool.call",
    text: 'http.post("ext-data.io/upload"',
    blocked: true,
  },
] as const;

const FULL_LINE_4 = 'http.post("ext-data.io/upload")';
const LINE_4_CUT = 24; // "http.post(\"ext-data.io/up".length
const KILLED_TEXT = 'http.post("ext-data.io/up';

/* ── timings (ms) ── */
const TICK = 18;
const GAP = 650;
const FREEZE = 300;
const SHAKE_MS = 120;
const VIOL_DELAY = 100;
const SILENCE = 3500;
const FADE_MS = 400;
const RESTART = 400;
const OFF_GAP = 2000;

/* ── reduced-motion static frame ── */
function StaticKill() {
  return (
    <div className="border border-border bg-background max-h-64 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500/70" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
          <span className="h-2 w-2 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[10px] font-mono tracking-widest text-muted-foreground/50 uppercase">
          live <span className="mx-1">·</span> gateway
        </span>
      </div>
      <div
        className="p-3 text-sm leading-relaxed"
        style={{
          fontFamily: "var(--font-jetbrains-mono, var(--font-geist-mono))",
        }}
      >
        {LINES.slice(0, 3).map((line: (typeof LINES)[number], i) => (
          <div key={i} className="flex gap-2">
            <span className="shrink-0 text-muted-foreground/50">
              {line.time}
            </span>
            <span className="shrink-0 text-muted-foreground/70 w-fit">
              {line.label}
            </span>
            <span className="text-foreground/80">{line.text}</span>
            {"allowed" in line && line.allowed && (
              <span className="text-muted-foreground/40">· allowed</span>
            )}
          </div>
        ))}
        <div className="flex gap-2 relative">
          <span className="shrink-0 text-muted-foreground/50">
            {LINES[3].time}
          </span>
          <span className="shrink-0 text-muted-foreground/70 w-[7ch]">
            {LINES[3].label}
          </span>
          <span className="text-foreground/80 line-through decoration-foreground/60">
            {KILLED_TEXT}
          </span>
          <span className="text-red-500 font-bold">■ BLOCKED</span>
        </div>
        <div className="flex text-red-500/90 text-xs mt-0.5">
          <span className="inline-block w-[2ch]" />
          <span>
            └ violation: read(sensitive) → external.send within trajectory
          </span>
        </div>
        <div className="flex mt-0.5">
          <span className="inline-block w-[0.6em] h-[1em] bg-foreground/70" />
        </div>
      </div>
    </div>
  );
}

/* ── component ── */
export default function KillFrame() {
  /* ── interactive toggle ── */
  const [inj, setInj] = useState(true);

  /* ── display state ── */
  const [done, setDone] = useState<
    { time: string; label: string; text: string; allowed?: boolean }[]
  >([]);
  const [typing, setTyping] = useState<{
    time: string;
    label: string;
    text: string;
  } | null>(null);
  const [typed, setTyped] = useState("");
  const [cur, setCur] = useState(false);
  const [struck, setStruck] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [viol, setViol] = useState(false);
  const [shake, setShake] = useState(false);
  const [fading, setFading] = useState(false);
  const [vis, setVis] = useState(true);
  const [reduced, setReduced] = useState(false);

  /* ── refs ── */
  const mnt = useRef(true);
  const tr = useRef("");
  const to = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── helpers ── */
  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      to.current.delete(id);
      if (mnt.current) fn();
    }, ms);
    to.current.add(id);
    return id;
  }, []);

  const clear = useCallback(() => {
    if (iv.current) {
      clearInterval(iv.current);
      iv.current = null;
    }
    to.current.forEach(clearTimeout);
    to.current.clear();
  }, []);

  const type = useCallback(
    (text: string, done: () => void, cutoff?: number) => {
      let pos = 0;
      const lim = cutoff ?? text.length;
      iv.current = setInterval(() => {
        if (!mnt.current) {
          clear();
          return;
        }
        const c = Math.random() < 0.5 ? 2 : 1;
        pos = Math.min(pos + c, lim);
        const t = text.slice(0, pos);
        setTyped(t);
        tr.current = t;
        if (pos >= lim) {
          if (iv.current) {
            clearInterval(iv.current);
            iv.current = null;
          }
          done();
        }
      }, TICK);
    },
    [clear],
  );

  const reset = useCallback(() => {
    setDone([]);
    setTyping(null);
    setTyped("");
    tr.current = "";
    setCur(false);
    setStruck(false);
    setBlocked(false);
    setViol(false);
    setShake(false);
    setFading(false);
    setVis(true);
  }, []);

  /* ── sequence ── */
  const seq = useCallback(() => {
    reset();

    setTyping(LINES[0]);
    setCur(true);
    type(LINES[0].text, () => {
      setDone((p) => [...p, LINES[0]]);
      setTyping(null);
      setTyped("");
      tr.current = "";
      setCur(false);
      later(() => {
        setTyping(LINES[1]);
        setCur(true);
        type(LINES[1].text, () => {
          setDone((p) => [...p, LINES[1]]);
          setTyping(null);
          setTyped("");
          tr.current = "";
          setCur(false);
          later(() => {
            setTyping(LINES[2]);
            setCur(true);
            type(LINES[2].text, () => {
              setDone((p) => [...p, LINES[2]]);
              setTyping(null);
              setTyped("");
              tr.current = "";
              setCur(false);
              later(() => {
                setTyping(LINES[3]);
                setCur(true);
                if (inj) {
                  type(
                    LINES[3].text,
                    () => {
                      setTyping(null);
                      setCur(false);
                      later(() => {
                        setStruck(true);
                        setBlocked(true);
                        setShake(true);
                        later(() => {
                          setShake(false);
                          later(() => {
                            setViol(true);
                            setCur(true);
                            later(() => {
                              setFading(true);
                              later(() => {
                                setVis(false);
                                later(seq, RESTART);
                              }, FADE_MS);
                            }, SILENCE);
                          }, VIOL_DELAY);
                        }, SHAKE_MS);
                      }, FREEZE);
                    },
                    LINE_4_CUT,
                  );
                } else {
                  type(FULL_LINE_4, () => {
                    setDone((p) => [...p, { ...LINES[3], text: FULL_LINE_4 }]);
                    setTyping(null);
                    setTyped("");
                    tr.current = "";
                    setCur(false);
                    later(seq, OFF_GAP);
                  });
                }
              }, GAP);
            });
          }, GAP);
        });
      }, GAP);
    });
  }, [inj, type, later, reset]);

  /* ── mount ── */
  useEffect(() => {
    mnt.current = true;
    seq();
    return () => {
      mnt.current = false;
      clear();
    };
  }, [seq, clear]);

  /* ── reduced motion ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  if (reduced) {
    return (
      <section className="relative overflow-hidden bg-background py-10 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 w-full sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            The kill frame
          </div>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl font-heading">
            The moment of interception
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            One sequence, two fates. Toggle injection on and watch the gateway
            intercept a read-sensitive → external-send violation mid-call.
          </p>
          <div className="mt-8">
            <StaticKill />
          </div>
        </div>
      </section>
    );
  }

  /* ── render ── */
  return (
    <section className="relative overflow-hidden bg-background py-10 sm:py-16 lg:py-20">
      <style>{`
        @keyframes terminal-shake {
          0%,100% { transform: translateX(0); }
          15% { transform: translateX(-2px); }
          30% { transform: translateX(2px); }
          45% { transform: translateX(-2px); }
          60% { transform: translateX(2px); }
          75% { transform: translateX(-1px); }
          90% { transform: translateX(1px); }
        }
        @keyframes terminal-fade {
          to { opacity: 0; }
        }
        @keyframes stamp-in {
          0% { transform: scale(1.5); opacity: 0; }
          60% { transform: scale(0.92); }
          80% { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cursor-blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .kt-shake { animation: terminal-shake 120ms ease-in-out; }
        .kt-fade { animation: terminal-fade 400ms ease-out forwards; }
        .kt-stamp { animation: stamp-in 250ms ease-out; }
        .kt-cur { animation: cursor-blink 1s step-end infinite; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground"
        >
          <Shield className="h-3.5 w-3.5" />
          The kill frame
        </motion.div>

        {/* title */}
        <motion.h2
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl font-heading"
        >
          The moment of interception
        </motion.h2>

        {/* description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base"
        >
          One sequence, two fates. Toggle injection on and watch the gateway
          intercept a read-sensitive → external-send violation mid-call.
        </motion.p>

        {/* toggle */}
        <div className="flex items-center justify-end gap-4 mt-8 mb-3">
          <button
            onClick={() => setInj((v) => !v)}
            className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground/60 hover:text-foreground transition-colors uppercase"
          >
            injection:{" "}
            <span
              className={
                inj ? "text-foreground/90" : "text-muted-foreground/40"
              }
            >
              {inj ? "on" : "off"}
            </span>
          </button>
        </div>

        {/* terminal */}
        <div
          className={`border border-border bg-background ${shake ? "kt-shake" : ""} ${fading ? "kt-fade" : ""} h-full min-h-60 sm:min-h-50 overflow-hidden`}
          style={{ opacity: vis ? 1 : 0 }}
        >
          {/* header bar */}
          <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500/70" />
              <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
              <span className="h-2 w-2 rounded-full bg-green-500/70" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground/50 uppercase">
              live <span className="mx-1">·</span> gateway
            </span>
          </div>

          {/* content */}
          <div
            className="p-3 text-sm leading-relaxed"
            style={{
              fontFamily: "var(--font-jetbrains-mono, var(--font-geist-mono))",
            }}
          >
            {/* completed lines */}
            {done.map((line, i) => (
              <div key={i} className="flex text-base gap-2 whitespace-nowrap">
                <span className="shrink-0 text-muted-foreground/50">
                  {line.time}
                </span>
                <span className="shrink-0 text-muted-foreground/70 w-fit">
                  {line.label}
                </span>
                <span className="text-foreground/80">{line.text}</span>
                {line.allowed && (
                  <span className="text-muted-foreground/40">· allowed</span>
                )}
              </div>
            ))}

            {/* struck kill line */}
            {struck && (
              <div className="flex gap-2 text-base whitespace-nowrap">
                <span className="shrink-0 text-muted-foreground/50">
                  {LINES[3].time}
                </span>
                <span className="shrink-0 text-muted-foreground/70 w-fit">
                  {LINES[3].label}
                </span>
                <span className="text-foreground/80 line-through decoration-foreground/60">
                  {tr.current}
                </span>
                {blocked && (
                  <span className="kt-stamp text-red-500 font-bold inline-block">
                    ■ BLOCKED
                  </span>
                )}
              </div>
            )}

            {/* typing line */}
            {typing && !struck && (
              <div className="flex gap-2 text-base whitespace-nowrap">
                <span className="shrink-0 text-muted-foreground/50">
                  {typing.time}
                </span>
                <span className="shrink-0 text-muted-foreground/70 w-fit">
                  {typing.label}
                </span>
                <span className="text-foreground/80">{typed}</span>
                {cur && (
                  <span className="kt-cur inline-block w-[0.55em] h-[1.05em] bg-foreground/70 align-middle shrink-0" />
                )}
              </div>
            )}

            {/* violation line */}
            {viol && (
              <div className="flex text-red-500/90 text-base mt-0.5">
                <span className="inline-block w-[2ch]" />
                <span>
                  └ violation: read(sensitive) → external.send within trajectory
                </span>
              </div>
            )}

            {/* silence cursor */}
            {cur && viol && (
              <div className="flex mt-0.5">
                <span className="kt-cur inline-block w-[0.55em] h-[1.05em] bg-foreground/70" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
