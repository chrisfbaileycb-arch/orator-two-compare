import JSZip from 'jszip';
import { DeliverableFile } from './types';

export const generateDeliverablesZip = async (files: DeliverableFile[]): Promise<Blob> => {
  const zip = new JSZip();

  for (const file of files) {
    // Trim leading slash for relative paths inside the archive
    const cleanPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
    zip.file(cleanPath, file.content);
  }

  // Include a manifest file
  const manifest = {
    generatedAt: new Date().toISOString(),
    generator: 'The AI Forge: Orator & Director v2.4',
    totalFiles: files.length,
    checksumAlgorithm: 'SHA-256',
    files: files.map(f => ({ path: f.path, badge: f.badge, sizeBytes: f.content.length }))
  };
  zip.file('MANIFEST.json', JSON.stringify(manifest, null, 2));

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });
};

export const downloadBlobAsFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
