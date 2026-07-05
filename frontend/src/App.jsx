import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const App = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("trimly_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("trimly_history", JSON.stringify(history));
  }, [history]);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setShortUrl("");
    setQrImage("");

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: targetUrl,
      });
      const generatedShortUrl = res.data.shortUrl;
      setShortUrl(generatedShortUrl);
      setCopied(false);

      // Generate QR Code data URL using qrcode package
      const qr = await QRCodeGenerator.toDataURL(generatedShortUrl);
      setQrImage(qr);

      // Save to history
      const newEntry = {
        id: Date.now(),
        original: targetUrl,
        short: generatedShortUrl,
        date: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setHistory((prev) => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
    } catch (err) {
      console.error("Error shortening URL", err);
      setError(
        err.response?.data?.error ||
        "Failed to shorten URL. Please check the address and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-slate-800 selection:bg-ocean/10 selection:text-ocean transition-all duration-300">
      {/* Premium Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-ocean flex items-center justify-center text-white shadow-md shadow-ocean/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <span className="text-5xl font-bold tracking-tight text-ocean">Trimly</span>
        </div>

      </header>

      {/* Main Hero & Shortener Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl w-full mx-auto gap-12">
        <div className="text-center space-y-4 max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Simplify your links, <br />
            <span className="text-ocean">amplify your reach.</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg">
            Create clean, memorable redirects in seconds. Analyze your clicks and boost accessibility with custom QR Codes.
          </p>
        </div>

        {/* Shortener Box */}
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleShorten} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Paste your long link here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean transition-all text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url}
                className="px-8 py-4 bg-ocean hover:bg-ocean-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-200 shadow-md shadow-ocean/10 hover:shadow-lg hover:shadow-ocean/20 flex items-center justify-center gap-2 shrink-0 text-base"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Shortening...</span>
                  </>
                ) : (
                  <span>Shorten URL</span>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-800 text-sm animate-fadeIn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0 text-rose-500">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.401 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Short URL Result Box */}
          {shortUrl && (
            <div className="mt-8 border-t border-slate-100 pt-8 animate-fadeIn space-y-6">
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your short link</span>
                  <div className="block truncate font-medium text-ocean text-lg select-all">
                    {shortUrl}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(shortUrl)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${copied
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                    : "bg-white border border-slate-200 hover:border-ocean hover:text-ocean text-slate-700 shadow-sm"
                    }`}
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.524 3h-4.52a2.25 2.25 0 0 0-2.142 1.888L6.29 8.241a2.25 2.25 0 0 0 .178 1.485l1.328 2.657a2.25 2.25 0 0 0 2.012 1.246h4.382a2.25 2.25 0 0 0 2.012-1.246l1.328-2.657a2.25 2.25 0 0 0 .178-1.485l-.667-4.353Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6M9 21h6" />
                      </svg>
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>

              {/* QR Code and Actions Panel */}
              <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50/50 border border-slate-100 rounded-2xl p-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 shrink-0">
                  <QRCode value={shortUrl} size={150} fgColor="#0B5497" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-800">Scan &amp; Share QR Code</h3>
                    <p className="text-sm text-slate-500">
                      Download the high-resolution QR code to print on packaging, banners, or business cards.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-ocean transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      <span>Visit Link</span>
                    </a>
                    {qrImage && (
                      <a
                        download="qr-code.png"
                        href={qrImage}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-ocean hover:text-ocean text-slate-700 text-sm font-medium rounded-xl transition-all shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        <span>Download QR Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Links History List */}
        {history.length > 0 && (
          <div className="w-full space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>Recent Links</span>
              </div>
              <button
                onClick={clearHistory}
                className="text-xs text-slate-400 hover:text-rose-500 font-medium transition-colors flex items-center gap-1 bg-none border-none cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                <span>Clear History</span>
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl divide-y divide-slate-100 overflow-hidden shadow-sm">
              {history.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <a
                        href={item.short}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-ocean hover:underline text-sm sm:text-base break-all"
                      >
                        {item.short}
                      </a>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono shrink-0 hidden sm:inline">
                        {item.date}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-full">
                      {item.original}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(item.short)}
                    className="p-2 text-slate-400 hover:text-ocean hover:bg-slate-50 rounded-xl transition-colors shrink-0 bg-transparent border-none cursor-pointer"
                    title="Copy Link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.524 3h-4.52a2.25 2.25 0 0 0-2.142 1.888L6.29 8.241a2.25 2.25 0 0 0 .178 1.485l1.328 2.657a2.25 2.25 0 0 0 2.012 1.246h4.382a2.25 2.25 0 0 0 2.012-1.246l1.328-2.657a2.25 2.25 0 0 0 .178-1.485l-.667-4.353Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6M9 21h6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>


    </div>
  );
};

export default App;
