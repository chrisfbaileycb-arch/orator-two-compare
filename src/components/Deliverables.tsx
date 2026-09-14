import React, { useState } from 'react';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  FolderArchive, 
  ExternalLink,
  Terminal,
  FileText
} from 'lucide-react';
import { generateDeliverables } from '../lib/generator';
import { generateDeliverablesZip, downloadBlobAsFile } from '../lib/zip';
import { DeliverableFile, InquestState } from '../lib/types';
import { voiceConduit } from '../lib/voice';

interface DeliverablesProps {
  inquestState: InquestState | null;
}

export const Deliverables: React.FC<DeliverablesProps> = ({ inquestState }) => {
  const [files] = useState<DeliverableFile[]>(() => generateDeliverables(inquestState));
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const activeFile = files[activeFileIndex] || files[0];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      voiceConduit.speak("Compressing and sealing all verified deliverables into ZIP archive.");
      const blob = await generateDeliverablesZip(files);
      downloadBlobAsFile(blob, 'ai-forge-deliverables-v2.4.zip');
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadSingleFile = (file: DeliverableFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    downloadBlobAsFile(blob, file.filename);
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-cyber text-amber-400 mb-1">
            <FileCode className="w-4 h-4" />
            <span>SYNTHETIC ARTIFACTS // SEALED &amp; VERIFIED</span>
          </div>
          <h2 className="font-cyber text-2xl sm:text-3xl font-bold text-neutral-100">
            System Deliverables &amp; Artifact Hub
          </h2>
          <p className="text-xs text-neutral-400 font-mono-cyber mt-1">
            Export production-ready architectural specifications, schemas, Docker clusters, and MCP configurations
          </p>
        </div>

        {/* Global Action: Download ZIP */}
        <div className="flex items-center gap-3">
          <button
            id="download-all-zip-btn"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-5 py-2.5 rounded-lg font-cyber font-bold text-xs sm:text-sm tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
          >
            <FolderArchive className="w-4 h-4" />
            <span>{isZipping ? 'COMPRESSING...' : 'DOWNLOAD ALL (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Main Files Layout: Left File Explorer, Right Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Files Navigation List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-cyber text-neutral-400 px-2 py-1">
            <span>PROJECT FILES ({files.length})</span>
            <span className="text-emerald-400 font-bold">SHA-256 VERIFIED</span>
          </div>

          <div className="space-y-1.5">
            {files.map((file, idx) => {
              const isSelected = idx === activeFileIndex;
              return (
                <div
                  key={file.filename}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-500/10'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`} />
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-cyber text-xs font-bold text-neutral-200">
                          {file.filename}
                        </span>
                        {file.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-cyber font-semibold bg-neutral-800 text-amber-400 border border-neutral-700">
                            {file.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {file.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono-cyber text-neutral-500 shrink-0 uppercase pl-2">
                    {file.language}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer & Inspector */}
        <div className="lg:col-span-8 bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* File Action Bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-neutral-900/90 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="font-mono-cyber text-xs font-bold text-amber-300">
                {activeFile.path}
              </span>
              <span className="text-[10px] font-mono-cyber text-neutral-500">
                ({activeFile.content.split('\n').length} lines, {activeFile.content.length} bytes)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded text-xs font-mono-cyber bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>

              <button
                onClick={() => handleDownloadSingleFile(activeFile)}
                className="px-3 py-1.5 rounded text-xs font-mono-cyber bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SAVE</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-5 overflow-x-auto max-h-[600px] overflow-y-auto font-mono-cyber text-xs text-neutral-200 leading-relaxed bg-neutral-950 select-text">
            <pre className="whitespace-pre">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
