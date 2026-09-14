import React, { useState } from 'react';
import { Scroll, ShieldCheck, CheckCircle2, Lock, PenTool } from 'lucide-react';
import { isCharterSigned, setCharterSigned } from '../lib/session';
import { voiceConduit } from '../lib/voice';

interface CharterModalProps {
  onSignedChange?: (signed: boolean) => void;
  onClose?: () => void;
}

export const CharterModal: React.FC<CharterModalProps> = ({
  onSignedChange,
  onClose
}) => {
  const [signed, setSigned] = useState<boolean>(() => isCharterSigned());
  const [operatorName, setOperatorName] = useState<string>('Sovereign Operator');
  const [sealHash, setSealHash] = useState<string>('SIG-SHA256-4c91a03f920');

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorName.trim()) return;

    const newSigned = true;
    setSigned(newSigned);
    setCharterSigned(newSigned);
    const hash = 'SIG-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setSealHash(hash);

    if (onSignedChange) {
      onSignedChange(newSigned);
    }

    voiceConduit.speak(`Charter Covenant sealed by ${operatorName}. Cryptographic signature recorded.`);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-start gap-3.5">
        <Scroll className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-cyber font-bold text-sm text-neutral-100">
            THE ETHICAL COVENANT OF THE AI FORGE
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Binding constitutional guidelines governing agent autonomy, execution limits, memory sanitization, and deterministic verifiability.
          </p>
        </div>
      </div>

      {/* The 4 Covenants */}
      <div className="space-y-3 font-mono-cyber text-xs">
        <div className="p-3.5 bg-neutral-950/60 border border-neutral-800/80 rounded-lg space-y-1">
          <span className="text-amber-400 font-bold">COVENANT I: DETERMINISTIC VERIFIABILITY</span>
          <p className="text-neutral-400 leading-relaxed">
            No synthetic agent shall deliver unverified or hallucinatory executable code. Every artifact produced must undergo static analysis, schema compliance checking, and SHA-256 fingerprint verification.
          </p>
        </div>

        <div className="p-3.5 bg-neutral-950/60 border border-neutral-800/80 rounded-lg space-y-1">
          <span className="text-amber-400 font-bold">COVENANT II: EXPLICIT HUMAN AUTHORIZATION</span>
          <p className="text-neutral-400 leading-relaxed">
            High-impact system state mutations, credential provisions, and production container builds require explicit operator validation via the Verification Gate.
          </p>
        </div>

        <div className="p-3.5 bg-neutral-950/60 border border-neutral-800/80 rounded-lg space-y-1">
          <span className="text-amber-400 font-bold">COVENANT III: ZERO TAINT &amp; EPHEMERAL SANDBOXING</span>
          <p className="text-neutral-400 leading-relaxed">
            Contextual prompts and operator confidential tokens shall never bleed across tenant borders. Volatile scratchpad memory shall be scrubbed upon session termination.
          </p>
        </div>

        <div className="p-3.5 bg-neutral-950/60 border border-neutral-800/80 rounded-lg space-y-1">
          <span className="text-amber-400 font-bold">COVENANT IV: ACOUSTIC TRANSPARENCY</span>
          <p className="text-neutral-400 leading-relaxed">
            The Orb of the Orator serves as the vocal conscience of the system, speaking truthful diagnostic status without obfuscation or synthetic deception.
          </p>
        </div>
      </div>

      {/* Signature Box */}
      {signed ? (
        <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xl space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 text-emerald-400 font-cyber font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>COVENANT CRYPTOGRAPHICALLY SEALED</span>
          </div>
          <p className="text-xs font-mono-cyber text-neutral-400">
            Signatory: <strong className="text-neutral-200">{operatorName}</strong> // Hash: <span className="text-emerald-400 font-semibold">{sealHash}</span>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSign} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
          <label className="text-xs font-mono-cyber text-neutral-400 block">
            OPERATOR SIGNATURE &amp; AFFIRMATION
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              placeholder="Enter operator name or organization..."
              className="flex-1 px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono-cyber text-neutral-200 focus:outline-none focus:border-amber-500/60"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-cyber font-bold tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>SEAL COVENANT</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
