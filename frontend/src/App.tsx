import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Chapter01Foundations } from './pages/Chapter01Foundations';
import { Chapter02AttentionLab } from './pages/Chapter02AttentionLab';
import { Chapter03ExplicitVsLatent } from './pages/Chapter03ExplicitVsLatent';
import { Chapter04LatentLab } from './pages/Chapter04LatentLab';
import { Chapter05BDHCaseStudy } from './pages/Chapter05BDHCaseStudy';
import { Chapter06Challenge } from './pages/Chapter06Challenge';
import { fetchHealth } from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function App() {
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [healthChecking, setHealthChecking] = useState<boolean>(false);

  const checkBackend = () => {
    setHealthChecking(true);
    fetchHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false))
      .finally(() => setHealthChecking(false));
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectChapter = (id: number) => {
    setCurrentChapter(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        currentChapter={currentChapter}
        onSelectChapter={handleSelectChapter}
        backendOnline={backendOnline}
      />

      {/* Offline Warning Banner */}
      {!backendOnline && (
        <div className="bg-rose-950/90 border-b border-rose-800/80 px-4 py-2.5 text-xs text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Python Computational Engine Offline:</strong> Make sure the FastAPI server is running on <code className="font-mono bg-rose-900/60 px-1 py-0.5 rounded">http://127.0.0.1:8000</code> (<code className="font-mono">python3 api/server.py</code>).
            </span>
          </div>
          <button
            onClick={checkBackend}
            disabled={healthChecking}
            className="px-2.5 py-1 rounded bg-rose-900 hover:bg-rose-850 text-rose-100 text-[11px] font-mono flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${healthChecking ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentChapter === 0 && <LandingPage onStartLab={handleSelectChapter} />}
        {currentChapter === 1 && <Chapter01Foundations onNextChapter={() => handleSelectChapter(2)} />}
        {currentChapter === 2 && <Chapter02AttentionLab onNextChapter={() => handleSelectChapter(3)} />}
        {currentChapter === 3 && <Chapter03ExplicitVsLatent onNextChapter={() => handleSelectChapter(4)} />}
        {currentChapter === 4 && <Chapter04LatentLab onNextChapter={() => handleSelectChapter(5)} />}
        {currentChapter === 5 && <Chapter05BDHCaseStudy onNextChapter={() => handleSelectChapter(6)} />}
        {currentChapter === 6 && (
          <Chapter06Challenge
            onRestartLab={() => handleSelectChapter(0)}
            onNavigateToChapter={handleSelectChapter}
          />
        )}
      </main>

      {/* Laboratory Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-300">
            Pathway — Latent Reasoning Laboratory • Interactive Research & Teaching Lab
          </p>
          <p className="text-[11px] text-slate-400">
            Pure NumPy Engine • Zero Database • Zero GPU Black-Boxes • Grounded in Vaswani et al. (2017), Kosowski et al. (2025), and Engdahl et al. (2026).
          </p>
          <p className="text-[10px] text-slate-400">
            Reference / Fallback Interface: <code className="text-slate-400">streamlit run main.py</code>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
