
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles, Paperclip, ImageIcon, AlertTriangle, History, ChevronLeft, Calendar, Zap, Download, Wand2, Eye, Trash2, Upload, AlertCircle, CreditCard } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { jsPDF } from 'https://esm.sh/jspdf';
import { LanguageCode } from '../App';
import { translations, languages as langList } from '../translations';

interface Attachment {
  mimeType: string;
  data: string;
  name: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachment?: Attachment;
  isAnalysis?: boolean;
  isError?: boolean;
}

interface AnalysisReport {
  id: string;
  timestamp: number;
  fileName: string;
  imagePreview: string;
  reportContent: string;
}

const AiAssistant: React.FC<{ language: LanguageCode; onClose: () => void }> = ({ language, onClose }) => {
  const t = translations[language].ai;
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.welcome }
  ]);
  const [view, setView] = useState<'chat' | 'history' | 'report-detail'>('chat');
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisReport[]>([]);
  
  const [input, setInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<Attachment | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dream3d_analysis_history');
    if (saved) {
      try {
        setAnalysisHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dream3d_analysis_history', JSON.stringify(analysisHistory));
  }, [analysisHistory]);

  useEffect(() => {
    if (scrollRef.current && view === 'chat') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiGenerating, view]);

  const addAssistantError = (errorMessage: string) => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: errorMessage,
      isError: true
    }]);
  };

  const blobToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      addAssistantError(t.errors.invalidFile);
      return;
    }

    setIsFileProcessing(true);
    try {
      const base64Data = await blobToBase64(file);
      setAttachedFile({
        mimeType: file.type || 'image/jpeg',
        data: base64Data,
        name: file.name
      });
    } catch (error) {
      console.error("File processing error:", error);
      addAssistantError(t.errors.processing);
    } finally {
      setIsFileProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  };

  const saveToHistory = (fileName: string, imagePreview: string, reportContent: string) => {
    const newReport: AnalysisReport = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      fileName,
      imagePreview,
      reportContent
    };
    setAnalysisHistory(prev => [newReport, ...prev].slice(0, 20));
  };

  const handleGenerateImage = async (customPrompt?: string) => {
    const lastAnalysis = messages.slice().reverse().find(m => m.role === 'assistant' && m.isAnalysis)?.content;
    const userMessageContent = customPrompt || input.trim();
    
    if (!userMessageContent && !attachedFile && !lastAnalysis) return;
    if (isAiGenerating || isFileProcessing) return;

    const currentAttachment = attachedFile;

    if (!customPrompt) {
      setInput('');
      setAttachedFile(null);
      setMessages(prev => [...prev, { 
        role: 'user', 
        content: userMessageContent || (language === 'it' ? "Genera visualizzazione 3D fotorealistica." : "Generate photorealistic 3D visualization."), 
        attachment: currentAttachment || undefined 
      }]);
    }

    setIsAiGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const promptParts: any[] = [];
      
      const contextDescription = lastAnalysis 
        ? `Based on the technical analysis indicating ${lastAnalysis.substring(0, 300)}..., create a high-quality visualization of this part optimized for 3D printing. ${userMessageContent ? `Specific user request: ${userMessageContent}` : ''}`
        : (userMessageContent || "A high-precision 3D printed engineering component.");

      let visualPrompt = `Industrial Product Visualization. Subject: ${contextDescription}. 
      Style: Photorealistic, 8k, studio lighting, technical macro photography, sharp edges, visible 3D printed layer textures.`;
      
      promptParts.push({ text: visualPrompt });
      if (currentAttachment) {
        promptParts.push({ inlineData: { mimeType: currentAttachment.mimeType, data: currentAttachment.data } });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: promptParts },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      let generatedImageUrl = '';
      let assistantText = language === 'it' ? "Ecco la visualizzazione fotorealistica del progetto:" : "Here is the photorealistic visualization of the project:";
      
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          } else if (part.text) {
            assistantText = part.text;
          }
        }
      }

      if (generatedImageUrl) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: assistantText,
          attachment: { mimeType: 'image/png', data: generatedImageUrl.split(',')[1], name: 'visualization.png' }
        }]);
      } else {
        addAssistantError(t.errors.emptyResponse);
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      addAssistantError(t.errors.aiService);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedFile) || isAiGenerating || isFileProcessing) return;

    const userMessageContent = input.trim();
    const currentAttachment = attachedFile;
    const isImageAnalysis = !!currentAttachment;
    const currentLangName = langList.find(l => l.code === language)?.name || 'English';
    
    setInput('');
    setAttachedFile(null);
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessageContent || (isImageAnalysis ? (language === 'it' ? "Esegui analisi tecnica e preventivo." : "Perform technical analysis and quote.") : "Richiesta inviata."), 
      attachment: currentAttachment || undefined 
    }]);
    
    setIsAiGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const promptParts: any[] = [];
      
      let technicalPrompt = userMessageContent;
      if (isImageAnalysis) {
        technicalPrompt = `PERFORM ADVANCED INDUSTRIAL DfAM ANALYSIS AND COST ESTIMATION (Language: ${currentLangName}):
        1. COMPONENT IDENTIFICATION: Identify the part's mechanical or functional purpose.
        2. GEOMETRY SCAN: Check for critical overhangs (>45°), wall thickness (<1mm), and support requirements.
        3. MANUFACTURING STRATEGY: Recommend material (e.g., Nylon CF, Resin, PLA) and tech (FDM/SLA).
        4. COST BREAKDOWN (Required):
           - Estimated Part Volume (cm³).
           - Estimated Print Time (h).
           - Operational Costs (Machine usage + Material consumption).
        5. PRELIMINARY QUOTE: Provide a estimated price range in EUR (€).`;
      }

      promptParts.push({ text: technicalPrompt || "Analyze this model." });
      if (currentAttachment) {
        promptParts.push({ inlineData: { mimeType: currentAttachment.mimeType, data: currentAttachment.data } });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: promptParts },
        config: {
          systemInstruction: `You are the Lead Manufacturing Engineer at Dream3D Studio. Be professional, technical, and precise. Language: ${currentLangName}. Always structure your quote clearly.`,
          temperature: 0.1,
        }
      });

      const text = response.text || "";
      if (text) {
        setMessages(prev => [...prev, { role: 'assistant', content: text, isAnalysis: isImageAnalysis }]);
        if (isImageAnalysis && currentAttachment) {
          saveToHistory(currentAttachment.name, `data:${currentAttachment.mimeType};base64,${currentAttachment.data}`, text);
        }
      } else {
        addAssistantError(t.errors.emptyResponse);
      }
    } catch (error) {
      console.error("AI Error:", error);
      addAssistantError(t.errors.aiService);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat(language, { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(timestamp);
  };

  const exportToPdf = async (report: AnalysisReport) => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      doc.setFillColor(10, 10, 11);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('Dream3D Engineering Report', 20, 25);
      doc.setFontSize(10);
      doc.text(`DATE: ${formatDate(report.timestamp)} | FILE: ${report.fileName}`, 20, 32);
      
      doc.setTextColor(40, 40, 40);
      try { doc.addImage(report.imagePreview, 'JPEG', 20, 50, 70, 70); } catch (e) {}
      
      doc.setFontSize(9);
      const splitText = doc.splitTextToSize(report.reportContent, 90);
      doc.text(splitText, 100, 55);
      
      doc.save(`Dream3D_Report_${report.id}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
      addAssistantError(t.errors.pdfExport);
    } finally {
      setIsExporting(false);
    }
  };

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnalysisHistory(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div 
      className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-[480px] h-full sm:h-[780px] bg-background-dark/95 backdrop-blur-3xl border border-white/10 sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-[60] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-500"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-md z-[70] flex flex-col items-center justify-center border-4 border-dashed border-primary m-4 rounded-2xl pointer-events-none animate-pulse">
          <Upload size={64} className="text-primary mb-4" />
          <p className="text-white font-bold text-xl uppercase tracking-widest">{language === 'it' ? 'Rilascia per analizzare' : 'Drop to Analyze'}</p>
        </div>
      )}

      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 via-transparent to-transparent flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary relative group">
            <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight flex items-center gap-2">
              DreamAI <span className="text-[9px] bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-full text-primary font-black uppercase tracking-widest">Studio</span>
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAiGenerating ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {view === 'history' ? t.history : view === 'report-detail' ? 'Documentation' : 'Live Engineering'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {view === 'chat' && (
            <button onClick={() => setView('history')} className={`p-2.5 rounded-xl transition-all ${analysisHistory.length > 0 ? 'text-primary bg-primary/10 hover:bg-primary/20' : 'text-slate-500 hover:bg-white/5'}`}>
              <History size={20} />
            </button>
          )}
          <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {view === 'chat' && (
          <div ref={scrollRef} className="h-full overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${m.role === 'user' ? 'bg-primary text-white' : m.isError ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-primary border border-white/10'}`}>
                  {m.role === 'user' ? <User size={18} /> : m.isError ? <AlertCircle size={18} /> : <Bot size={18} />}
                </div>
                <div className={`space-y-3 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl text-[13px] shadow-lg ${m.role === 'user' ? 'bg-primary text-white' : m.isError ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-slate-300 border border-white/5'}`}>
                    {m.isAnalysis && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-primary font-bold text-[10px] uppercase tracking-wider">
                          <AlertTriangle size={14} /> {t.reportTitle}
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">{m.content.split('\n\n')[0]}</div>
                        {m.content.includes('QUOTE') || m.content.includes('EUR') || m.content.includes('PREVENTIVO') ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mt-3 space-y-2">
                             <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest border-b border-emerald-500/20 pb-2">
                                <CreditCard size={14} /> {t.quoteTitle}
                             </div>
                             <div className="whitespace-pre-wrap leading-relaxed italic text-emerald-100/80">
                                {m.content.split('\n\n').slice(1).join('\n\n')}
                             </div>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                        )}
                      </div>
                    )}
                    {!m.isAnalysis && <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>}
                    
                    {i === 0 && (
                      <button onClick={() => fileInputRef.current?.click()} className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[10px] font-bold uppercase hover:bg-primary hover:text-white transition-all group">
                        <Upload size={14} className="group-hover:-translate-y-1 transition-transform" /> {language === 'it' ? 'Carica Progetto' : 'Upload Project'}
                      </button>
                    )}

                    {m.isAnalysis && !isAiGenerating && (
                      <button onClick={() => handleGenerateImage(language === 'it' ? "Genera visualizzazione 3D ottimizzata." : "Generate optimized 3D visualization.")} className="mt-4 w-full py-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[10px] font-bold uppercase hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group">
                        <Wand2 size={12} className="group-hover:rotate-12 transition-transform" /> {t.generate} Visualization
                      </button>
                    )}
                  </div>
                  {m.attachment && (
                    <div className="group relative rounded-2xl overflow-hidden border border-white/10 max-w-[240px] shadow-2xl">
                      <img src={`data:${m.attachment.mimeType};base64,${m.attachment.data}`} className="w-full object-cover" alt="Technical File" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isAiGenerating && (
              <div className="flex gap-4 animate-in fade-in">
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-white/10 text-primary border border-white/10">
                  <Bot size={18} />
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-3 min-w-[220px]">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">{t.scanStatus}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'history' && (
          <div className="h-full flex flex-col p-6 animate-in slide-in-from-right duration-300">
            <button onClick={() => setView('chat')} className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase mb-8 group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t.backChat}
            </button>
            <h4 className="text-white font-display text-xl font-bold mb-6 flex items-center gap-2">
              <History size={18} className="text-primary" /> {t.history}
            </h4>
            <div className="space-y-4 overflow-y-auto scrollbar-hide flex-1 pb-6">
              {analysisHistory.length === 0 ? (
                <div className="text-center py-24 text-slate-600 italic font-light">{t.noReports}</div>
              ) : (
                analysisHistory.map((report) => (
                  <div key={report.id} onClick={() => { setSelectedReport(report); setView('report-detail'); }} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer group shadow-lg">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-800">
                      <img src={report.imagePreview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Part" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate group-hover:text-primary transition-colors">{report.fileName}</p>
                      <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(report.timestamp)}
                      </p>
                    </div>
                    <button onClick={(e) => deleteFromHistory(report.id, e)} className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'report-detail' && selectedReport && (
          <div className="h-full flex flex-col p-6 animate-in slide-in-from-right duration-300 overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setView('history')} className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase group">
                <ChevronLeft size={14} /> {t.backHistory}
              </button>
              <button onClick={() => exportToPdf(selectedReport)} disabled={isExporting} className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-bold uppercase shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2">
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Export PDF
              </button>
            </div>
            <div className="space-y-6 pb-6">
              <img src={selectedReport.imagePreview} className="w-full rounded-3xl border border-white/10 shadow-2xl" alt="Model" />
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.certified}</span>
                  <span className="text-[10px] text-primary font-black uppercase">{formatDate(selectedReport.timestamp)}</span>
                </div>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-light">
                  {selectedReport.reportContent}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {view === 'chat' && (
        <div className="p-6 bg-card-dark/80 border-t border-white/10 space-y-4 shrink-0">
          {attachedFile && (
            <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/30 rounded-2xl animate-in zoom-in-95 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl overflow-hidden border border-primary/40 flex items-center justify-center relative">
                   <img src={`data:${attachedFile.mimeType};base64,${attachedFile.data}`} className="w-full h-full object-cover" alt="Thumb" />
                </div>
                <div>
                   <p className="text-[11px] text-slate-200 font-bold truncate max-w-[180px]">{attachedFile.name}</p>
                   <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Ready for Analysis</p>
                </div>
              </div>
              <button onClick={() => setAttachedFile(null)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {attachedFile && (
              <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-bottom-2">
                <button onClick={handleSend} disabled={isAiGenerating} className="py-3.5 bg-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all">
                  <Zap size={16} className="fill-white" /> {t.analyze}
                </button>
                <button onClick={() => handleGenerateImage()} disabled={isAiGenerating} className="py-3.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white active:scale-95 transition-all">
                  <Wand2 size={16} /> {t.generate}
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <button onClick={() => fileInputRef.current?.click()} className={`p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center relative group ${attachedFile ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 border-white/10 text-slate-500 hover:text-primary'}`}>
                <Paperclip size={22} className="group-hover:rotate-45 transition-transform" />
                {isFileProcessing && <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl"><Loader2 size={16} className="animate-spin text-white" /></div>}
              </button>

              <div className="relative flex-1">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={attachedFile ? t.placeholderReq : t.placeholderMsg} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 pr-24" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  {!attachedFile && (input.trim() || messages.some(m => m.isAnalysis)) && (
                    <button onClick={() => handleGenerateImage()} disabled={isAiGenerating} className="w-9 h-9 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all group">
                      {isAiGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} className="group-hover:rotate-12 transition-transform" />}
                    </button>
                  )}
                  <button onClick={handleSend} disabled={(!input.trim() && !attachedFile) || isAiGenerating} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${attachedFile || input.trim() ? 'bg-primary text-white shadow-primary/30 hover:brightness-110' : 'bg-white/10 text-slate-600'}`}>
                    {isAiGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
