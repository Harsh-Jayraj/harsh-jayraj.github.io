import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * MBASCAPE – Campus Escape Game (Single-file React component)
 *
 * How to play
 * 1) Click regions on the campus map.
 * 2) Solve a short puzzle in each region to "escape" that area.
 * 3) After solving, search the region to see if a clue is hidden.
 * 4) Drag collected clue tiles into the Final Lock tray (right panel).
 * 5) Arrange tiles to form the secret word, then press UNLOCK.
 * 6) Beat the countdown timer!
 *
 * Notes
 * - Designed for quick facilitation at college events.
 * - All data is in this file, so you can remix puzzles/regions easily.
 * - No external APIs; Tailwind classes for styling.
 */

export default function MBASCAPE() {
  // ------------------------------
  // Game Configuration
  // ------------------------------
  const GAME_DURATION_MINUTES = 30; // total time in minutes

  // The final secret word to unlock the WAY OUT LOCK.
  // Feel free to change to any word/phrase (avoid spaces in the targetWord).
  const targetWord = "ESCAPE"; // 6 letters

  // Campus regions with puzzles. Some yield clues, some are red herrings.
  // You can add/remove regions – map and list render automatically.
  const regions = useMemo(
    () => [
      {
        id: "library",
        name: "Library",
        color: "bg-emerald-200",
        puzzle: {
          prompt:
            "Caesar Cipher (shift 3): Decode the word → KHOOR. (Answer in UPPERCASE)",
          answer: "HELLO",
          tip: "Shift each letter 3 steps backward.",
        },
        clue: { letter: "E", note: "I begin the word that frees you (1st)." },
      },
      {
        id: "academic",
        name: "Academic Block",
        color: "bg-sky-200",
        puzzle: {
          prompt:
            "Logic: If 2▲ = 8 and 3▲ = 27, then 4▲ = ? (▲ means 'raised to itself')",
          answer: "256",
          tip: "2^2 = 4 → not 8? Think 2^3? No. 'Raised to itself' means 2^2, 3^3, 4^4...",
        },
        clue: { letter: "S", note: "Second in sequence (2nd)." },
      },
      {
        id: "hostel",
        name: "Hostel",
        color: "bg-amber-200",
        puzzle: {
          prompt:
            "Riddle: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
          answer: "ECHO",
          tip: "Classic riddle – sound that returns.",
        },
        clue: { letter: "C", note: "Third in sequence (3rd)." },
      },
      {
        id: "mess",
        name: "Mess & Cafeteria",
        color: "bg-rose-200",
        puzzle: {
          prompt: "Unscramble: AEMLS (food related)",
          answer: "MEALS",
          tip: "Rearrange letters.",
        },
        clue: { letter: "A", note: "Fourth in sequence (4th)." },
      },
      {
        id: "sports",
        name: "Sports Ground",
        color: "bg-lime-200",
        puzzle: {
          prompt:
            "Sequence: 1, 1, 2, 3, 5, 8, 13, ?  (Type the next number)",
          answer: "21",
          tip: "Fibonacci.",
        },
        // Red herring – this one sometimes hides a duplicate letter E.
        clue: { letter: "E", note: "A duplicate that might help or confuse (extra E)." },
      },
      {
        id: "amphi",
        name: "Amphitheatre",
        color: "bg-violet-200",
        puzzle: {
          prompt:
            "Wordplay: The anagram of 'PACE SE' (two words) is your final target word. What single word is it? (UPPERCASE)",
          answer: "ESCAPE",
          tip: "Rearrange PACE SE.",
        },
        clue: { letter: "P", note: "Fifth in sequence (5th)." },
      },
    ],
    []
  );

  // ------------------------------
  // State
  // ------------------------------
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION_MINUTES * 60);
  const [openRegionId, setOpenRegionId] = useState(null as string | null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [searched, setSearched] = useState<Record<string, boolean>>({});
  const [clues, setClues] = useState<{ id: string; letter: string; note: string }[]>(
    []
  );
  const [tray, setTray] = useState<string[]>([]); // ordered letters dragged to final tray
  const [message, setMessage] = useState<string | null>(null);
  const [win, setWin] = useState(false);
  const [lost, setLost] = useState(false);

  // Timer
  useEffect(() => {
    if (!started || win || lost) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setLost(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, win, lost]);

  // Reset
  const resetGame = () => {
    setStarted(false);
    setSecondsLeft(GAME_DURATION_MINUTES * 60);
    setOpenRegionId(null);
    setAnswers({});
    setSolved({});
    setSearched({});
    setClues([]);
    setTray([]);
    setMessage(null);
    setWin(false);
    setLost(false);
  };

  // Helpers
  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const currentRegion = useMemo(
    () => regions.find((r) => r.id === openRegionId) || null,
    [openRegionId, regions]
  );

  // Search region to reveal clue (if any) once solved.
  const handleSearch = (regionId: string) => {
    if (!solved[regionId]) {
      setMessage("Solve the puzzle first!");
      return;
    }
    if (searched[regionId]) {
      setMessage("You've already searched here.");
      return;
    }

    const r = regions.find((x) => x.id === regionId)!;
    setSearched((s) => ({ ...s, [regionId]: true }));
    if (r.clue) {
      // Avoid duplicate identical tiles unless intended.
      const newTileId = `${regionId}-${r.clue.letter}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;
      setClues((c) => [
        ...c,
        { id: newTileId, letter: r.clue!.letter, note: r.clue!.note },
      ]);
      setMessage(`You found a clue tile: '${r.clue.letter}'.`);
    } else {
      setMessage("No clue hidden in this region. Try others!");
    }
  };

  // Submit puzzle answer
  const submitAnswer = (regionId: string) => {
    const r = regions.find((x) => x.id === regionId)!;
    const user = (answers[regionId] || "").trim();

    // Accept in a forgiving manner (case-insensitive numbers/words)
    const correct = r.puzzle.answer.toString().trim().toUpperCase();
    const mine = user.toString().trim().toUpperCase();
    if (mine === correct) {
      setSolved((s) => ({ ...s, [regionId]: true }));
      setMessage("✅ Correct! You escaped this region. Now search for a clue.");
    } else {
      setMessage("❌ Not quite. Think logically. Check the tip.");
    }
  };

  // Drag & Drop for clue tiles → tray
  const draggingIdRef = useRef<string | null>(null);

  const onDragStart = (e: React.DragEvent, id: string) => {
    draggingIdRef.current = id;
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropToTray = (e: React.DragEvent) => {
    e.preventDefault();
    const id = draggingIdRef.current;
    draggingIdRef.current = null;
    if (!id) return;

    const tile = clues.find((t) => t.id === id);
    if (!tile) return;

    setTray((t) => [...t, tile.letter]);
    setClues((c) => c.filter((x) => x.id !== id));
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Remove last tile from tray back to clues
  const removeLastFromTray = () => {
    if (tray.length === 0) return;
    const last = tray[tray.length - 1];
    // Return it as a new tile (id regenerated)
    const newId = `return-${last}-${Math.random().toString(36).slice(2, 6)}`;
    setClues((c) => [...c, { id: newId, letter: last, note: "Returned tile" }]);
    setTray((t) => t.slice(0, -1));
  };

  // Shuffle tiles in tray
  const shuffleTray = () => {
    setTray((arr) =>
      [...arr].sort(() => Math.random() - 0.5)
    );
  };

  // Attempt unlock
  const tryUnlock = () => {
    const attempt = tray.join("");
    if (attempt === targetWord) {
      setWin(true);
      setMessage("🔓 WAY OUT LOCK opened! You escaped IMT Nagpur. 🎉");
    } else {
      setMessage(
        `Lock refused: '${attempt || ""}'. Arrange the tiles to form the correct word.`
      );
    }
  };

  // UI atoms
  const Tag = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full bg-zinc-800 text-white px-2 py-0.5 text-xs">
      {children}
    </span>
  );

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-50 to-zinc-200 text-zinc-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <h1 className="text-2xl font-bold tracking-tight">MBASCAPE – IMT Nagpur</h1>
            <Tag>Campus Escape</Tag>
          </div>
          <div className="flex items-center gap-3">
            <div className={`font-mono text-lg ${secondsLeft <= 60 ? "text-rose-600 animate-pulse" : ""}`}>
              ⏳ {fmt(secondsLeft)}
            </div>
            {!started ? (
              <button
                onClick={() => setStarted(true)}
                className="px-3 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow"
              >
                Start Game
              </button>
            ) : (
              <button
                onClick={resetGame}
                className="px-3 py-2 rounded-xl bg-white border hover:bg-zinc-50 shadow"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Map & Regions */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Campus Map</h2>
            <p className="text-sm text-zinc-600">Click a region → solve → search for clues.</p>
          </div>

          {/* Simple grid map – replace with an actual map image if desired */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setOpenRegionId(r.id)}
                className={`relative aspect-video rounded-2xl ${r.color} p-3 text-left shadow hover:shadow-md transition group border`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-zinc-700">{r.id}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className={`font-semibold ${solved[r.id] ? "text-emerald-700" : "text-zinc-700"}`}>
                      {solved[r.id] ? "Escaped" : "Locked"}
                    </div>
                    <div className={`mt-1 ${searched[r.id] ? "text-emerald-700" : "text-zinc-700"}`}>
                      🔎 {searched[r.id] ? "Searched" : "Unsearched"}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-x-3 bottom-3 text-xs opacity-0 group-hover:opacity-100 transition">
                  <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-2 py-1 rounded-full border">
                    <span>Open Puzzle</span> <span>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Message to player */}
          {message && (
            <div className="mt-4 p-3 rounded-xl bg-white border text-sm shadow">
              {message}
            </div>
          )}

          {/* Win/Lose banners */}
          {win && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 font-medium">
              🎉 Congratulations! The WAY OUT LOCK is open. You escaped with time to spare.
            </div>
          )}
          {lost && !win && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-100 border border-rose-300 font-medium">
              ⌛ Time's up! The campus gates remain locked… Try again!
            </div>
          )}
        </section>

        {/* Right panel – Inventory & Final Lock */}
        <aside className="lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Inventory & Lock</h2>
          </div>

          {/* Inventory */}
          <div className="rounded-2xl bg-white border shadow">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="font-medium">Clue Tiles</div>
              <div className="text-xs text-zinc-600">Drag into the tray →</div>
            </div>
            <div className="p-3 grid grid-cols-6 gap-2 min-h-[72px] items-start">
              {clues.length === 0 && (
                <div className="col-span-6 text-xs text-zinc-500">
                  No clues yet. Solve a region and search it!
                </div>
              )}
              {clues.map((tile) => (
                <div
                  key={tile.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, tile.id)}
                  className="select-none cursor-grab active:cursor-grabbing bg-zinc-900 text-white rounded-xl py-2 text-center shadow"
                  title={tile.note}
                >
                  <div className="text-lg font-bold leading-none">{tile.letter}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tray */}
          <div className="mt-4 rounded-2xl bg-white border shadow">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="font-medium">Final Lock Tray</div>
              <div className="text-xs text-zinc-600">Target: {targetWord}</div>
            </div>
            <div
              className="p-4 min-h-[88px] grid grid-cols-6 gap-2"
              onDragOver={onDragOver}
              onDrop={onDropToTray}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-xl border-dashed border-2 border-zinc-300 bg-zinc-50 flex items-center justify-center font-bold"
                >
                  {tray[i] || ""}
                </div>
              ))}
            </div>
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={removeLastFromTray}
                  className="px-3 py-2 rounded-xl bg-white border hover:bg-zinc-50 shadow text-sm"
                >
                  Undo
                </button>
                <button
                  onClick={shuffleTray}
                  className="px-3 py-2 rounded-xl bg-white border hover:bg-zinc-50 shadow text-sm"
                >
                  Shuffle
                </button>
              </div>
              <button
                onClick={tryUnlock}
                className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 shadow"
              >
                UNLOCK
              </button>
            </div>
          </div>

          {/* How to win hint (optional) */}
          <div className="mt-4 p-3 rounded-2xl bg-yellow-50 border text-sm">
            <div className="font-medium mb-1">Tip</div>
            Gather enough letters to spell the secret word. Some regions may hide duplicate letters or red herrings.
          </div>
        </aside>
      </main>

      {/* Region Modal */}
      {currentRegion && (
        <div className="fixed inset-0 z-20 bg-black/40 flex items-center justify-center p-4" onClick={() => setOpenRegionId(null)}>
          <div
            className="w-full max-w-xl rounded-2xl bg-white border shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{currentRegion.name}</div>
                <div className="text-xs text-zinc-600">Puzzle & Search</div>
              </div>
              <button
                onClick={() => setOpenRegionId(null)}
                className="px-3 py-1.5 rounded-xl bg-white border hover:bg-zinc-50 text-sm"
              >
                Close
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-sm">{currentRegion.puzzle.prompt}</div>

              <div className="flex items-center gap-2">
                <input
                  className="flex-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-300"
                  placeholder="Type your answer…"
                  value={answers[currentRegion.id] || ""}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, [currentRegion.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitAnswer(currentRegion.id);
                  }}
                />
                <button
                  onClick={() => submitAnswer(currentRegion.id)}
                  className="px-3 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
                >
                  Submit
                </button>
              </div>

              <div className="text-xs text-zinc-600">Hint: {currentRegion.puzzle.tip}</div>

              <div className="pt-2 border-t flex items-center justify-between">
                <div className="text-sm">
                  Status: {solved[currentRegion.id] ? "✅ Escaped" : "🔒 Locked"} · {searched[currentRegion.id] ? "🔎 Searched" : "🗺️ Unsearched"}
                </div>
                <button
                  onClick={() => handleSearch(currentRegion.id)}
                  className={`px-3 py-2 rounded-xl border shadow text-sm ${
                    solved[currentRegion.id]
                      ? "bg-white hover:bg-zinc-50"
                      : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  }`}
                  disabled={!solved[currentRegion.id]}
                >
                  Search Region
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-zinc-600 flex items-center justify-between">
          <div>© {new Date().getFullYear()} MBASCAPE • Built for IMT Nagpur campus events</div>
          <div>
            <a
              className="underline hover:no-underline"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(
                  "Facilitator tips:\n\n• You can change puzzles/answers/targetWord in code.\n• Consider projecting this on a screen and letting teams take turns.\n• To scale difficulty, add red-herring regions or time penalties for wrong answers.\n• Replace the grid cards with a campus map image and absolutely-positioned hotspots."
                );
              }}
            >
              Facilitator Tips
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
