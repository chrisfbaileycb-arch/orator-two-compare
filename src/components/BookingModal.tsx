import React, { useState } from 'react';
import { Calendar, CheckCircle2, Send, Cpu, Clock, ShieldCheck } from 'lucide-react';
import { voiceConduit } from '../lib/voice';

interface BookingModalProps {
  onClose?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  const [operator, setOperator] = useState<string>('Enterprise Engineering');
  const [environment, setEnvironment] = useState<string>('GCP Cloud Run (Container Sandbox)');
  const [tier, setTier] = useState<string>('L3 Sovereign Autonomous');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-20');
  const [selectedTime, setSelectedTime] = useState<string>('14:00 UTC');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = 'DISP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setBookingRef(ref);
    setIsBooked(true);
    voiceConduit.speak(`Deployment dispatch session booked for ${selectedDate}. Reference code ${ref}.`);
  };

  return (
    <div className="space-y-6">
      {isBooked ? (
        <div className="p-6 bg-emerald-950/25 border border-emerald-800/60 rounded-xl space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h4 className="font-cyber font-bold text-base text-neutral-100">
              DEPLOYMENT DISPATCH CONFIRMED
            </h4>
            <p className="text-xs text-neutral-400 font-mono-cyber mt-1">
              Dispatch Session Reference: <strong className="text-emerald-400 font-bold">{bookingRef}</strong>
            </p>
          </div>

          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono-cyber text-left space-y-1.5 text-neutral-300 max-w-md mx-auto">
            <div><strong>Environment:</strong> {environment}</div>
            <div><strong>Autonomy Tier:</strong> {tier}</div>
            <div><strong>Scheduled Window:</strong> {selectedDate} at {selectedTime}</div>
          </div>

          <p className="text-xs text-neutral-400 font-light">
            A verification sentinel has been provisioned. The Orator will chime 15 minutes prior to synchronization.
          </p>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-cyber font-bold tracking-wider bg-neutral-800 hover:bg-neutral-750 text-neutral-200 transition-colors"
          >
            RETURN TO NEXUS
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono-cyber text-neutral-400">
              OPERATING ENTITY OR TEAM
            </label>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              required
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono-cyber text-neutral-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono-cyber text-neutral-400">
                TARGET CLUSTER RUNTIME
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono-cyber text-neutral-200 focus:outline-none focus:border-amber-500/60"
              >
                <option>GCP Cloud Run (Container Sandbox)</option>
                <option>Docker Compose (Local Airgap)</option>
                <option>Kubernetes Multi-Tenant Cluster</option>
                <option>Bare Metal Stdio Hardware Mesh</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono-cyber text-neutral-400">
                AUTONOMY &amp; RISK LEVEL
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono-cyber text-neutral-200 focus:outline-none focus:border-amber-500/60"
              >
                <option>L3 Sovereign Autonomous (DAG Engine)</option>
                <option>L2 Operational (Human-in-Loop Verification)</option>
                <option>L1 Read-Only Sentinel (Advisory Only)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono-cyber text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>PREFERRED DISPATCH DATE</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono-cyber text-neutral-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono-cyber text-neutral-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>SYNCHRONIZATION WINDOW</span>
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono-cyber text-neutral-200 focus:outline-none focus:border-amber-500/60"
              >
                <option>10:00 UTC (Asia/EMEA Synchrony)</option>
                <option>14:00 UTC (Atlantic Crossing)</option>
                <option>18:00 UTC (Americas Prime)</option>
                <option>22:00 UTC (Pacific Night Stream)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-xs font-cyber font-bold tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>CONFIRM DEPLOYMENT DISPATCH</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
