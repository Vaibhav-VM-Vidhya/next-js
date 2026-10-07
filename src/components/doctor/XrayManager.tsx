import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DentalDocument } from '../../types';
import {
  Image as ImageIcon,
  Plus,
  ZoomIn,
  ZoomOut,
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  Tag,
  Calendar,
  X,
  FileCheck,
} from 'lucide-react';

export const XrayManager: React.FC = () => {
  const { documents, selectedPatient, addDocument } = useApp();

  const patientDocs = documents.filter(
    (d) => d.patientId === selectedPatient?.id || true
  );

  const [activeDoc, setActiveDoc] = useState<DentalDocument>(patientDocs[0] || documents[0]);
  const [isInverted, setIsInverted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DentalDocument['category']>('X-Ray OPG');
  const [newToothTags, setNewToothTags] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !newTitle) return;

    const sampleImages: Record<string, string> = {
      'X-Ray OPG': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
      'IOPA Periapical': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
      'CBCT 3D': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
      'Intraoral Photo': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
      'Lab Report': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
      'Consent Form': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    };

    const doc = addDocument({
      patientId: selectedPatient.id,
      title: newTitle,
      category: newCategory,
      fileUrl: sampleImages[newCategory] || sampleImages['X-Ray OPG'],
      thumbnailUrl: sampleImages[newCategory] || sampleImages['X-Ray OPG'],
      toothNumbers: newToothTags ? newToothTags.split(',').map((n) => parseInt(n.trim())).filter((n) => !isNaN(n)) : [],
      notes: newNotes,
    });

    setActiveDoc(doc);
    setIsUploadOpen(false);
    setNewTitle('');
    setNewToothTags('');
    setNewNotes('');
  };

  const resetFilters = () => {
    setIsInverted(false);
    setZoomLevel(1);
    setBrightness(100);
    setContrast(100);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            <span>Digital Radiographs & Imaging Suite</span>
          </h2>
          <p className="text-xs text-slate-500">
            High-contrast diagnostic viewer for panoramic OPGs, IOPA periapicals, and clinical photography
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Radiograph</span>
        </button>
      </div>

      {/* Main Radiograph Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Film Gallery Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
              Patient Radiograph Series ({patientDocs.length})
            </h3>

            <div className="space-y-2.5">
              {patientDocs.map((doc) => {
                const isActive = activeDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setActiveDoc(doc);
                      resetFilters();
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'border-purple-500 bg-purple-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="h-24 rounded-lg overflow-hidden bg-slate-900 mb-2 relative">
                      <img
                        src={doc.fileUrl}
                        alt={doc.title}
                        className="w-full h-full object-cover filter contrast-125"
                      />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-sm bg-slate-950/80 text-[9px] font-bold text-purple-300 uppercase">
                        {doc.category}
                      </span>
                    </div>

                    <strong className="text-xs font-bold text-slate-900 block truncate">
                      {doc.title}
                    </strong>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{doc.date}</span>
                      {doc.toothNumbers && doc.toothNumbers.length > 0 && (
                        <span className="font-semibold text-purple-600">
                          #{doc.toothNumbers.join(', #')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Interactive High-Contrast Radiograph Viewer */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-2xl flex flex-col">
            {/* Viewer Toolbar */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3 text-xs">
              <div>
                <h4 className="font-bold text-white text-sm">{activeDoc?.title}</h4>
                <p className="text-[11px] text-slate-400">
                  {activeDoc?.category} • Taken on {activeDoc?.date}
                </p>
              </div>

              {/* Diagnostic Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsInverted(!isInverted)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center space-x-1.5 ${
                    isInverted
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                  title="Invert radiograph black/white contrast for bone density evaluation"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Invert Contrast</span>
                </button>

                <div className="flex items-center bg-slate-800 rounded-xl p-1 space-x-1">
                  <button
                    onClick={() => setZoomLevel(Math.max(0.6, zoomLevel - 0.2))}
                    className="p-1 text-slate-300 hover:text-white"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-400 px-1">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.2))}
                    className="p-1 text-slate-300 hover:text-white"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={resetFilters}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                  title="Reset filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewport Frame */}
            <div className="h-[440px] overflow-hidden flex items-center justify-center bg-black/60 rounded-2xl relative my-4">
              {activeDoc ? (
                <img
                  src={activeDoc.fileUrl}
                  alt={activeDoc.title}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%) ${
                      isInverted ? 'invert(1)' : ''
                    }`,
                    transition: 'transform 0.15s ease, filter 0.2s ease',
                  }}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-slate-600 text-xs">No radiograph selected</span>
              )}

              {/* Tooth Tag Overlay Pin */}
              {activeDoc?.toothNumbers && activeDoc.toothNumbers.length > 0 && (
                <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl text-white text-xs flex items-center space-x-2">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                  <span>Charted Teeth: #{activeDoc.toothNumbers.join(', #')}</span>
                </div>
              )}
            </div>

            {/* Brightness & Contrast Fine Sliders */}
            <div className="grid grid-cols-2 gap-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center space-x-3">
                <span className="w-20">Brightness: {brightness}%</span>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="flex-1 accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-3">
                <span className="w-20">Contrast: {contrast}%</span>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="flex-1 accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Radiologist / Clinical Diagnostic Notes */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <strong className="text-white block font-semibold mb-1">
                Clinical Diagnostic Findings:
              </strong>
              <p>{activeDoc?.notes || 'No specialized radiologic findings annotated.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Upload New Dental Radiograph</h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Film Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Post-Op IOPA Tooth #46"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Imaging Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                >
                  <option value="X-Ray OPG">Digital Panoramic OPG</option>
                  <option value="IOPA Periapical">IOPA Periapical Film</option>
                  <option value="CBCT 3D">CBCT 3D Volumetric Scan</option>
                  <option value="Intraoral Photo">High-Res Intraoral Photo</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Related Tooth Numbers</label>
                <input
                  type="text"
                  value={newToothTags}
                  onChange={(e) => setNewToothTags(e.target.value)}
                  placeholder="e.g. 16, 21, 46"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Diagnostic Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Normal lamina dura, no periapical radiolucency observed."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs"
                >
                  Save Radiograph
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
