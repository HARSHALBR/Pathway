import React from 'react';
import { 
  Atom, 
  Layers, 
  Split, 
  Cpu, 
  Network, 
  CheckCircle2, 
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface Chapter {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
}

export const CHAPTERS: Chapter[] = [
  { id: 0, slug: 'home', title: 'Laboratory Overview', shortTitle: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
  { id: 1, slug: 'foundations', title: 'Chapter 01: Transformer Foundations', shortTitle: '01 Foundations', icon: <Atom className="w-3.5 h-3.5" /> },
  { id: 2, slug: 'attention', title: 'Chapter 02: Attention Laboratory', shortTitle: '02 Attention', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 3, slug: 'explicit-vs-latent', title: 'Chapter 03: Explicit vs. Latent', shortTitle: '03 Explicit vs Latent', icon: <Split className="w-3.5 h-3.5" /> },
  { id: 4, slug: 'latent-lab', title: 'Chapter 04: Latent Reasoning Lab', shortTitle: '04 Latent Lab', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 5, slug: 'bdh', title: 'Chapter 05: BDH & BDH-CQ Research', shortTitle: '05 BDH Research', icon: <Network className="w-3.5 h-3.5" /> },
  { id: 6, slug: 'challenge', title: 'Chapter 06: Diagnostic Challenge', shortTitle: '06 Challenge', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
];

interface Props {
  currentChapter: number;
  onSelectChapter: (id: number) => void;
  backendOnline: boolean;
}

export const Navbar: React.FC<Props> = ({ currentChapter, onSelectChapter, backendOnline }) => {
  const prevChapter = currentChapter > 0 ? currentChapter - 1 : null;
  const nextChapter = currentChapter < CHAPTERS.length - 1 ? currentChapter + 1 : null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="lab-container">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => onSelectChapter(0)}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-slate-900 text-sm block leading-none">
                PATHWAY
              </span>
              <span className="text-[11px] text-slate-500 font-normal block leading-tight mt-0.5">
                Latent Reasoning Laboratory
              </span>
            </div>
          </div>

          {/* CENTER: Chapter Navigation Pipeline */}
          <nav className="hidden lg:flex items-center gap-1">
            {CHAPTERS.map((ch) => {
              const active = ch.id === currentChapter;
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectChapter(ch.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-indigo-600' : 'bg-transparent'}`} />
                  <span>{ch.shortTitle}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Backend indicator & Stepper */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="hidden sm:inline text-slate-700 font-sans text-[11px] font-medium">
                {backendOnline ? 'NumPy Online' : 'Engine Offline'}
              </span>
            </div>

            <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-xl border border-slate-200">
              <button
                disabled={prevChapter === null}
                onClick={() => prevChapter !== null && onSelectChapter(prevChapter)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous Chapter"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-indigo-600 px-1.5 font-bold">
                {currentChapter} / {CHAPTERS.length - 1}
              </span>
              <button
                disabled={nextChapter === null}
                onClick={() => nextChapter !== null && onSelectChapter(nextChapter)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next Chapter"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Chapter Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                ch.id === currentChapter
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                  : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              {ch.shortTitle}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
