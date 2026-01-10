import { useState, useEffect } from "react";
import api from "../api/axios";

function Apply() {
  const [company, setCompany] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [jobText, setJobText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await api.get("/api/user/profile");
        setUserName(res.data.user.name);
      } catch {}
    };
    fetchUserName();
  }, []);

  const handleGenerate = async () => {
    if (!jobText || !company) {
      alert("Enter company name and job description");
      return;
    }
    setGenerating(true);
    try {
      const res = await api.post("/generate-email", { jobText, company });
      setEmailText(res.data.emailText + "\n" + userName);
    } catch {
      alert("Failed to generate email");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!company || !toEmail || !emailText) {
      alert("Fill all fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/application/apply", {
        company,
        toEmail,
        emailText,
      });
      alert("Application sent successfully");
      setCompany("");
      setToEmail("");
      setJobText("");
      setEmailText("");
    } catch {
      alert("Failed to send application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-10">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">
          Apply for a Job
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Generate and send professional job emails
        </p>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
            text-white placeholder-slate-400 focus:ring-2 focus:ring-white/20 outline-none"
          />

          <input
            type="email"
            placeholder="Recruiter Email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
            text-white placeholder-slate-400 focus:ring-2 focus:ring-white/20 outline-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <textarea
              rows="10"
              placeholder="Paste job description..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 p-4
              text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-white/20 outline-none"
            />

            <textarea
              rows="10"
              placeholder="Generated email..."
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 p-4
              text-white placeholder-slate-400 resize-none outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between mt-8">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-3 rounded-xl border border-white/10
            hover:bg-white/10 transition disabled:opacity-60"
          >
            {generating ? "Generating..." : "Generate Email"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-xl
            hover:bg-slate-200 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Apply;
