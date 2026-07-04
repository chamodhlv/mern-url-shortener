import React from "react";
import { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");

  const handleShorten = async () => {
    if (!url) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });
      setShortUrl(res.data.shortUrl);
      setCopied(false);
    } catch {
      console.error("Error shortening URL");
    }
  };

  return <div>App</div>;
};

export default App;
