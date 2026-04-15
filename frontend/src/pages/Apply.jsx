import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Apply() {
  const [company, setCompany] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [jobText, setJobText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/user/profile");
        setProfile(res.data.user);
      } catch {}
    };

    fetchProfile();
  }, []);

  const handleGenerate = async () => {
    if (!jobText || !company) {
      alert("Enter company name and job description");
      return;
    }

    setGenerating(true);
    try {
      const res = await api.post("/generate-email", { jobText, company });
      const signature = profile?.name ? `\n\n${profile.name}` : "";
      setEmailText(`${res.data.emailText}${signature}`);
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

    if (!profile?.gmailConnected) {
      alert("Connect Gmail in your profile before sending applications");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/application/apply", {
        company,
        toEmail,
        emailText,
      });

      alert(`Application sent from ${res.data.senderEmail}`);
      setCompany("");
      setToEmail("");
      setJobText("");
      setEmailText("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send application");
    } finally {
      setLoading(false);
    }
  };

  const gmailReady = Boolean(profile?.gmailConnected);

  return (
    <div className="mx-auto max-w-5xl pt-10">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
        <h1 className="mb-1 text-3xl font-semibold tracking-tight text-white">
          Apply for a Job
        </h1>
        <p className="mb-8 text-sm text-slate-400">
          Generate and send professional cold emails from your connected Gmail account.
        </p>

        <div className="mb-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-slate-300">
            Gmail status:{" "}
            <span className={gmailReady ? "text-emerald-300" : "text-amber-300"}>
              {gmailReady ? `Connected as ${profile.gmailEmail}` : "Not connected"}
            </span>
          </p>

          {!gmailReady ? (
            <p className="mt-2 text-sm text-slate-400">
              Connect Gmail first from your{" "}
              <Link to="/profile" className="text-blue-400 underline">
                profile page
              </Link>{" "}
              so the Send button can deliver emails directly.
            </p>
          ) : null}
        </div>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/20"
          />

          <input
            type="email"
            placeholder="Recruiter Email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/20"
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <textarea
              rows="10"
              placeholder="Paste job description..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              className="resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/20"
            />

            <textarea
              rows="10"
              placeholder="Generated email..."
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              className="resize-none rounded-xl border border-white/10 bg-black/40 p-4 text-white placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-xl border border-white/10 px-6 py-3 transition hover:bg-white/10 disabled:opacity-60"
          >
            {generating ? "Generating..." : "Generate Email"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !gmailReady}
            className="rounded-xl bg-white px-6 py-3 text-black transition hover:bg-slate-200 disabled:opacity-60"
          >
            {loading ? "Sending..." : gmailReady ? "Send Application" : "Connect Gmail First"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Apply;
