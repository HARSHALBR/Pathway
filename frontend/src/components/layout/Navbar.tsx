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
  { id: 0, slug: 'home', title: 'Laboratory Overview', shortTitle: 'Home', icon: <Home className="w-4 h-4" /> },
  { id: 1, slug: 'foundations', title: 'Chapter 01: Transformer Foundations', shortTitle: '01 Foundations', icon: <Atom className="w-4 h-4" /> },
  { id: 2, slug: 'attention', title: 'Chapter 02: Attention Laboratory', shortTitle: '02 Attention', icon: <Layers className="w-4 h-4" /> },
  { id: 3, slug: 'explicit-vs-latent', title: 'Chapter 03: Explicit vs. Latent', shortTitle: '03 Explicit vs Latent', icon: <Split className="w-4 h-4" /> },
  { id: 4, slug: 'latent-lab', title: 'Chapter 04: Latent Reasoning Lab', shortTitle: '04 Latent Lab', icon: <Cpu className="w-4 h-4" /> },
  { id: 5, slug: 'bdh', title: 'Chapter 05: BDH & BDH-CQ Research', shortTitle: '05 BDH Research', icon: <Network className="w-4 h-4" /> },
  { id: 6, slug: 'challenge', title: 'Chapter 06: Diagnostic Challenge', shortTitle: '06 Challenge', icon: <CheckCircle2 className="w-4 h-4" /> },
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
    <header className="sticky top-0 z-40 bg-[#03060C]/90 backdrop-blur-xl border-b border-cyan-500/15 shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectChapter(0)}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-cyan-400/30">
              <Cpu className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-white text-base font-mono">PATHWAY</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold">
                  INSTRUMENT
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">Latent Reasoning Laboratory</p>
            </div>
          </div>

          {/* Center: Chapter Pipeline */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#090E1A]/90 p-1 rounded-xl border border-cyan-500/20 shadow-inner">
            {CHAPTERS.map((ch) => {
              const active = ch.id === currentChapter;
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectChapter(ch.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/30 border border-cyan-300/40'
                      : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-slate-400'}>{ch.icon}</span>
                  <span>{ch.shortTitle}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Chapter Stepper & Backend indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse' : 'bg-rose-500'}`} />
              <span className="hidden sm:inline text-slate-300 font-mono text-[11px]">
                {backendOnline ? 'NUMPY // ONLINE' : 'ENGINE // OFFLINE'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={prevChapter === null}
                onClick={() => prevChapter !== null && onSelectChapter(prevChapter)}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-500/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous Chapter"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-cyan-300 px-1 font-bold">
                {currentChapter} / {CHAPTERS.length - 1}
              </span>
              <button
                disabled={nextChapter === null}
                onClick={() => nextChapter !== null && onSelectChapter(nextChapter)}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-500/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next Chapter"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Chapter Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
          {CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                ch.id === currentChapter
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 bg-slate-900/60'
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
