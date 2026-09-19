import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  Volume2,
  VolumeX,
  ShieldCheck,
  Camera,
  FileCheck,
  Pill,
  Activity,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Printer,
  Eye,
  X,
  Video,
  AlertTriangle,
  Info,
  MapPin,
  HelpCircle,
  Stethoscope,
} from "lucide-react";
import { Language, SeniorProfile, ExplainedDocumentResult } from "../types";
import { sampleDocuments } from "../data/mockSeniorData";
import { speechHelper } from "../utils/speech";
import { getTranslation } from "../utils/translations";
import { getDocumentUIStrings } from "../utils/documentTranslations";

interface DocumentSimplifierProps {
  profile: SeniorProfile;
}

interface UploadedFileInfo {
  name: string;
  type: string;
  size: string;
  dataUrl?: string;
  previewUrl?: string;
}

export const DocumentSimplifier: React.FC<DocumentSimplifierProps> = ({
  profile,
}) => {
  const t = getTranslation(profile.language);

  // Document state
  const [selectedSample, setSelectedSample] = useState<string>("");
  const [documentText, setDocumentText] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);

  // Camera state
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [result, setResult] = useState<ExplainedDocumentResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showRawText, setShowRawText] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [isManualTextOpen, setIsManualTextOpen] = useState<boolean>(false);

  // Initialize with the first sample document so senior sees an immediate working experience
  useEffect(() => {
    if (sampleDocuments.length > 0 && !result && !uploadedFile && !documentText) {
      const firstSample = sampleDocuments[0];
      setSelectedSample(firstSample.id);
      setDocumentText(firstSample.preview);
    }
  }, []);

  // Cleanup camera stream when modal closes or component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
      speechHelper.stop();
    };
  }, [cameraStream]);

  // Handle selecting one of the curated sample documents
  const handleSelectSample = (sample: typeof sampleDocuments[0]) => {
    speechHelper.stop();
    setIsSpeaking(false);
    setSelectedSample(sample.id);
    setDocumentText(sample.preview);
    setUploadedFile(null);
    setFileBase64(null);
    setMimeType(null);
    setResult(null);
  };

  // Process a loaded file (Image or PDF)
  const processSelectedFile = (file: File) => {
    speechHelper.stop();
    setIsSpeaking(false);
    setSelectedSample("");
    setResult(null);

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const fileInfo: UploadedFileInfo = {
      name: file.name,
      type: file.type,
      size: sizeFormatted,
    };

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      fileInfo.dataUrl = dataUrl;
      if (isImage) {
        fileInfo.previewUrl = dataUrl;
      }
      setUploadedFile(fileInfo);
      setFileBase64(dataUrl);
      setMimeType(isImage ? file.type || "image/jpeg" : "application/pdf");
    };

    reader.readAsDataURL(file);
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  // Camera Management
  const startDesktopCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setCameraStream(stream);
      setCameraModalOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err: any) {
      console.warn("Desktop camera unavailable, triggering mobile camera input:", err);
      // Fallback: Trigger standard mobile camera capture directly
      if (mobileCameraInputRef.current) {
        mobileCameraInputRef.current.click();
      } else {
        setCameraError(
          profile.language === "Hindi"
            ? "कैमरा शुरू नहीं हो सका। कृपया फोटो अपलोड विकल्प का उपयोग करें।"
            : "Camera could not be started. Please use the image upload button."
        );
      }
    }
  };

  const closeDesktopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraModalOpen(false);
    setCameraError(null);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const capturedInfo: UploadedFileInfo = {
        name: `Prescription_Photo_${new Date().toISOString().slice(0, 10)}.jpg`,
        type: "image/jpeg",
        size: "Camera Snapshot",
        previewUrl: dataUrl,
        dataUrl,
      };
      setUploadedFile(capturedInfo);
      setFileBase64(dataUrl);
      setMimeType("image/jpeg");
      setSelectedSample("");
      setResult(null);
    }
    closeDesktopCamera();
  };

  const dt = getDocumentUIStrings(profile.language);
  const prevLangRef = useRef<Language>(profile.language);

  // Re-run explanation if the user changes language while viewing a document
  useEffect(() => {
    if (prevLangRef.current !== profile.language) {
      const newLang = profile.language;
      prevLangRef.current = newLang;
      speechHelper.stop();
      setIsSpeaking(false);
      if (documentText.trim() || fileBase64) {
        handleExplainDocument(newLang);
      }
    }
  }, [profile.language]);

  // Main Action: Analyze and Explain Document
  const handleExplainDocument = async (langOverride?: Language) => {
    if (!documentText.trim() && !fileBase64) return;
    const targetLang = langOverride || profile.language;
    const targetDt = getDocumentUIStrings(targetLang);

    setIsLoading(true);
    setResult(null);
    setLoadingStep(targetDt.stepReading);

    try {
      // Step 2 indicator
      setTimeout(() => {
        setLoadingStep(targetDt.stepAnalyzing);
      }, 900);

      const response = await fetch("/api/companion/explain-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: documentText.trim(),
          fileBase64: fileBase64,
          mimeType: mimeType,
          documentCategory: selectedSample
            ? sampleDocuments.find((s) => s.id === selectedSample)?.category || "healthcare"
            : "healthcare",
          language: targetLang,
          seniorProfile: {
            name: profile.name,
            preferredHonorific: profile.preferredHonorific,
            primaryDoctor: profile.primaryDoctor,
            medicalConditions: profile.medicalConditions,
          },
        }),
      });

      const data: ExplainedDocumentResult = await response.json();
      setResult(data);

      // Speak friendly greeting & summary aloud for voice accessibility in selected language
      if (data.simpleSummary) {
        setIsSpeaking(true);
        const speechText = `${data.documentTitle}. ${data.simpleSummary} ${
          data.safeAdvice ? data.safeAdvice : ""
        }`;
        speechHelper.speak(speechText, {
          rate: profile.voiceSpeed || 0.88,
          language: targetLang,
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } catch (error) {
      console.error("Failed to explain document:", error);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleToggleAudio = () => {
    if (isSpeaking) {
      speechHelper.stop();
      setIsSpeaking(false);
    } else if (result) {
      setIsSpeaking(true);
      const parts = [
        result.documentTitle,
        result.simpleSummary,
        result.actionItems?.length
          ? `Important steps: ${result.actionItems
              .slice(0, 2)
              .map((a) => a.action)
              .join(". ")}`
          : "",
        result.safeAdvice,
      ];
      speechHelper.speak(parts.filter(Boolean).join(". "), {
        rate: profile.voiceSpeed || 0.88,
        language: profile.language,
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const clearCurrentDocument = () => {
    speechHelper.stop();
    setIsSpeaking(false);
    setUploadedFile(null);
    setFileBase64(null);
    setMimeType(null);
    setDocumentText("");
    setSelectedSample("");
    setResult(null);
  };

  return (
    <div id="explain-document-module" className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl border border-[#dce7de] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
              <FileText className="w-7 h-7 text-emerald-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                  {t.modDocBadge}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  AI Senior Assistant
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 tracking-tight mt-1">
                {t.modDocTitle}
              </h2>
              <p className="text-stone-700 text-base font-medium mt-1">
                {dt.headerSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Upload / Input Choice Bar */}
        <div className="mt-6 pt-6 border-t border-stone-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Action 1: Upload Image */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border-2 border-emerald-200 hover:border-emerald-400 text-emerald-950 font-bold text-base transition active:scale-95 cursor-pointer min-h-[56px] shadow-2xs"
            >
              <UploadCloud className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>{dt.uploadImage}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) processSelectedFile(e.target.files[0]);
              }}
            />

            {/* Action 2: Upload PDF */}
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-teal-50 hover:bg-teal-100/80 border-2 border-teal-200 hover:border-teal-400 text-teal-950 font-bold text-base transition active:scale-95 cursor-pointer min-h-[56px] shadow-2xs"
            >
              <FileCheck className="w-5 h-5 text-teal-700 shrink-0" />
              <span>{dt.uploadPdf}</span>
            </button>
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) processSelectedFile(e.target.files[0]);
              }}
            />

            {/* Action 3: Take / Upload Photo of Document */}
            <button
              type="button"
              onClick={startDesktopCamera}
              className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border-2 border-sky-200 hover:border-sky-400 text-sky-950 font-bold text-base transition active:scale-95 cursor-pointer min-h-[56px] shadow-2xs"
            >
              <Camera className="w-5 h-5 text-sky-700 shrink-0" />
              <span>{dt.takePhoto}</span>
            </button>
            {/* Hidden mobile camera capture input */}
            <input
              ref={mobileCameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) processSelectedFile(e.target.files[0]);
              }}
            />
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition ${
              dragOver
                ? "border-emerald-500 bg-emerald-50"
                : "border-stone-200 bg-stone-50/50 hover:bg-stone-50"
            }`}
          >
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              {dragOver ? dt.dragDropActive : dt.dragDropNotice}
            </p>
          </div>

          {/* Curated Sample Documents to test immediately */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                {dt.sampleDocsTitle}
              </span>
              <span className="text-xs text-stone-400 font-medium">
                {dt.sampleDocsSubtitle}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {sampleDocuments.map((s) => {
                const sampleLocalized = dt.sampleTitles[s.id] || {
                  title: s.title,
                  tag: s.tag,
                };
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSample(s)}
                    className={`p-2.5 rounded-2xl border text-left transition active:scale-95 cursor-pointer min-h-[48px] ${
                      selectedSample === s.id
                        ? "bg-emerald-100 border-emerald-600 text-emerald-950 font-bold shadow-2xs"
                        : "bg-white border-stone-200 hover:border-emerald-300 text-stone-700 font-medium"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block tracking-wider truncate">
                      {sampleLocalized.tag}
                    </span>
                    <span className="text-xs font-semibold line-clamp-1 mt-0.5">
                      {sampleLocalized.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional: Paste / Edit Document Text */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsManualTextOpen(!isManualTextOpen)}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              {isManualTextOpen ? (
                <ChevronUp className="w-4 h-4 text-emerald-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-700" />
              )}
              <span>
                {isManualTextOpen ? dt.hidePasteToggle : dt.viewPasteToggle}
              </span>
            </button>

            {isManualTextOpen && (
              <div className="mt-2 space-y-2">
                <textarea
                  value={documentText}
                  onChange={(e) => {
                    setDocumentText(e.target.value);
                    setSelectedSample("");
                  }}
                  rows={4}
                  placeholder={dt.pastePlaceholder}
                  className="w-full p-3.5 rounded-2xl border-2 border-stone-200 focus:border-emerald-600 focus:outline-none text-sm text-stone-800 font-medium bg-stone-50/70"
                />
              </div>
            )}
          </div>

          {/* Active File / Sample Selection Card */}
          {(uploadedFile || documentText) && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {uploadedFile?.previewUrl ? (
                  <img
                    src={uploadedFile.previewUrl}
                    alt="Document preview"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-emerald-300 shadow-2xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-950">
                      {dt.readyToExplain}
                    </span>
                    {uploadedFile && (
                      <span className="text-xs text-stone-500 font-medium">
                        {uploadedFile.size}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base mt-0.5 line-clamp-1">
                    {uploadedFile
                      ? uploadedFile.name
                      : selectedSample && dt.sampleTitles[selectedSample]
                      ? dt.sampleTitles[selectedSample].title
                      : selectedSample
                      ? sampleDocuments.find((s) => s.id === selectedSample)?.title
                      : "Custom Document Text"}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearCurrentDocument}
                  className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm transition cursor-pointer min-h-[44px]"
                >
                  {dt.clearBtn}
                </button>

                <button
                  type="button"
                  id="explain-document-submit-btn"
                  onClick={() => handleExplainDocument()}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base transition shadow-md active:scale-95 cursor-pointer disabled:opacity-50 min-h-[48px]"
                >
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                  <span>
                    {isLoading ? t.statusThinking : dt.explainBtn}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Loading Animation Card */}
          {isLoading && (
            <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-emerald-950">
                  {loadingStep || dt.stepReading}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
                  {dt.stepAnalyzing}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Camera Modal for Desktop & Laptop Webcams */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-stone-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-lg text-stone-900">
                  {dt.captureModalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeDesktopCamera}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              {dt.captureModalDesc}
            </p>

            {/* Video Viewfinder */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-emerald-500">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Document Alignment Frame Guides */}
              <div className="absolute inset-6 border-2 border-dashed border-white/70 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <span className="text-[11px] font-bold text-white bg-black/60 px-2 py-0.5 rounded self-start">
                  {dt.alignFrameGuide}
                </span>
              </div>
            </div>

            {cameraError && (
              <p className="text-xs text-rose-600 font-bold">{cameraError}</p>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={closeDesktopCamera}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm cursor-pointer"
              >
                {dt.cancelBtn}
              </button>

              <button
                type="button"
                onClick={capturePhotoFromCamera}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base shadow-md transition active:scale-95 cursor-pointer min-h-[48px]"
              >
                <Camera className="w-5 h-5" />
                <span>{dt.takePhotoBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Structured Results Presentation */}
      {result && (
        <div
          id="explained-document-result"
          className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn print:border-none print:shadow-none"
        >
          {/* Top Result Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {result.documentTypeLabel || "Explained Document"}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {dt.aiConfidence}: {result.confidenceLevel === "high" ? dt.highConfidence : "✓"}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                {result.documentTitle}
              </h3>
            </div>

            {/* Voice & Print Controls */}
            <div className="flex items-center gap-2 print:hidden">
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer min-h-[44px] ${
                  isSpeaking
                    ? "bg-rose-100 text-rose-900 hover:bg-rose-200"
                    : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 shadow-2xs"
                }`}
                title="Listen to the explanation aloud"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-700" />
                    <span>{dt.stopVoice}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                    <span>{dt.listenVoice}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition cursor-pointer min-h-[44px]"
                title="Print this simple explanation"
              >
                <Printer className="w-4 h-4 text-stone-600" />
                <span className="hidden sm:inline">{dt.printBtn}</span>
              </button>
            </div>
          </div>

          {/* Section 1: Simple Summary */}
          <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              {dt.sec1Summary}
            </span>
            <p className="text-lg sm:text-xl font-bold text-stone-900 leading-relaxed">
              {result.simpleSummary}
            </p>
          </div>

          {/* Section 2: Key Dates & Deadlines */}
          {result.keyDates && result.keyDates.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                {dt.sec2Dates}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.keyDates.map((d, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      d.isUrgent
                        ? "bg-amber-50 border-amber-300 text-amber-950"
                        : "bg-stone-50 border-stone-200 text-stone-900"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold block text-stone-500">
                        {d.label}
                      </span>
                      <span className="text-base font-extrabold text-stone-900 mt-0.5 block">
                        {d.date}
                      </span>
                    </div>
                    {d.isUrgent && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 shrink-0">
                        {dt.urgentBadge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Medicines & Dosages (For Prescriptions & Pharmacy Bills) */}
          {result.medicines && result.medicines.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-700" />
                  <span>{dt.sec3Medicines}</span>
                </h4>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  {result.medicines.length} {dt.medicinesCount}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.medicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border-2 border-emerald-200 shadow-2xs space-y-2 hover:border-emerald-400 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-extrabold text-base text-stone-900">
                        {med.name}
                      </h5>
                      {med.quantity && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 shrink-0">
                          {med.quantity}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 font-bold text-emerald-900">
                        <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{med.dosage}</span>
                      </div>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-700 font-medium">
                        {med.timing}
                      </span>
                    </div>

                    {med.instructions && (
                      <p className="text-xs sm:text-sm text-stone-600 bg-stone-50 p-2 rounded-xl font-medium border border-stone-100">
                        💡 {med.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Lab & Diagnostic Test Results */}
          {result.testsAndResults && result.testsAndResults.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-700" />
                <span>{dt.sec4LabTests}</span>
              </h4>

              <div className="space-y-2.5">
                {result.testsAndResults.map((test, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-stone-900 text-base">
                          {test.testName}
                        </h5>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            test.status === "normal"
                              ? "bg-emerald-100 text-emerald-800"
                              : test.status === "borderline"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {test.status === "normal"
                            ? dt.normalBadge
                            : test.status === "borderline"
                            ? dt.borderlineBadge
                            : dt.attentionBadge}
                        </span>
                      </div>
                      <p className="text-sm text-stone-700 font-medium">
                        {test.plainMeaning}
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-base font-extrabold text-stone-900">
                        Result: {test.resultValue}
                      </div>
                      {test.normalRange && (
                        <div className="text-xs text-stone-500 font-medium">
                          Normal: {test.normalRange}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Billing & Money Breakdown */}
          {result.billingDetails && (
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
                <h4 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-700" />
                  <span>{dt.sec5Billing}</span>
                </h4>

                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="text-stone-500 block text-xs">
                      {dt.totalBilled}
                    </span>
                    <span className="font-bold text-stone-800">
                      {result.billingDetails.totalAmount}
                    </span>
                  </div>
                  {result.billingDetails.balanceDue && (
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-950 font-extrabold text-sm border border-emerald-300">
                      {dt.balanceDue} {result.billingDetails.balanceDue}
                    </div>
                  )}
                </div>
              </div>

              {result.billingDetails.breakdown &&
                result.billingDetails.breakdown.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                      {dt.itemizedBreakdown}
                    </span>
                    <div className="divide-y divide-stone-200 bg-white rounded-xl border border-stone-200 p-2">
                      {result.billingDetails.breakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1.5 px-2 text-sm"
                        >
                          <span className="text-stone-700 font-medium">
                            {item.item}
                          </span>
                          <span className="font-bold text-stone-900">
                            {item.cost}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Section 6: Appointment Instructions */}
          {result.appointmentDetails && (
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
              <h4 className="text-base font-extrabold text-sky-950 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-700" />
                <span>{dt.sec6Appointment}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs font-semibold text-stone-500 block">
                    {dt.doctorClinic}
                  </span>
                  <span className="font-bold text-stone-900">
                    {result.appointmentDetails.doctorOrClinic}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-stone-500 block">
                    {dt.dateTime}
                  </span>
                  <span className="font-bold text-stone-900">
                    {result.appointmentDetails.dateTime}
                  </span>
                </div>
                {result.appointmentDetails.location && (
                  <div className="sm:col-span-2 flex items-start gap-1.5 text-stone-700">
                    <MapPin className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                    <span>{result.appointmentDetails.location}</span>
                  </div>
                )}
              </div>

              {result.appointmentDetails.preparationInstructions &&
                result.appointmentDetails.preparationInstructions.length > 0 && (
                  <div className="pt-2 border-t border-sky-100">
                    <span className="text-xs font-bold text-sky-900 block mb-1">
                      {dt.prepInstructions}
                    </span>
                    <ul className="space-y-1 text-sm text-stone-700 font-medium">
                      {result.appointmentDetails.preparationInstructions.map(
                        (inst, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-sky-600 font-bold">•</span>
                            <span>{inst}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {/* Section 7: Clear Action Items for You */}
          {result.actionItems && result.actionItems.length > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <h4 className="font-extrabold text-base text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{dt.sec7ActionItems}</span>
              </h4>

              <div className="space-y-2">
                {result.actionItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-base font-bold text-stone-900">
                            {item.action}
                          </p>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              item.priority === "must_do"
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {item.priority === "must_do"
                              ? dt.mustDoBadge
                              : dt.forRecordsBadge}
                          </span>
                        </div>
                        {item.tip && (
                          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                            💡 {item.tip}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 8: Medical & Billing Terms Decoded */}
          {result.medicalTermsExplained &&
            result.medicalTermsExplained.length > 0 && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  {dt.sec8Terms}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.medicalTermsExplained.map((term, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white border border-stone-200 text-sm"
                    >
                      <span className="font-extrabold text-stone-900 block">
                        {term.term}:
                      </span>
                      <span className="text-stone-600 font-medium text-xs sm:text-sm mt-0.5 block">
                        {term.plainMeaning}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Section 9: Reassurance & Safety Advice */}
          {result.safeAdvice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-sm text-emerald-950">
                  {dt.sec9Safety}
                </h5>
                <p className="text-sm text-stone-700 font-medium mt-0.5">
                  {result.safeAdvice}
                </p>
                {result.disclaimer && (
                  <p className="text-xs text-stone-500 italic mt-2">
                    {result.disclaimer}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Section 10: Original Document Text (Expandable Accordion) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowRawText(!showRawText)}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-stone-600" />
              <span>
                {showRawText ? dt.hideRawText : dt.sec10RawText}
              </span>
            </button>

            {showRawText && (
              <div className="mt-2 p-4 rounded-2xl bg-stone-100 border border-stone-300 font-mono text-xs text-stone-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {result.extractedTextPreview ||
                  documentText ||
                  "Document image processed directly by GenAI vision."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
