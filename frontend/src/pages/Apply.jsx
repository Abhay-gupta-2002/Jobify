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
      } catch (err) {
        console.log(err);
      }
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
    <div className="max-w-5xl mx-auto pt-6 px-4">
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">Apply for a Job</h1>
        <p className="text-sm text-gray-500 mb-6">
          Generate and send a professional application email
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
          />

          <input
            type="email"
            placeholder="Recruiter Email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              rows="10"
              placeholder="Paste job description here..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              className="border rounded-md p-3 resize-none"
            />
            <textarea
              rows="10"
              placeholder="Generated email will appear here..."
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              className="border rounded-md p-3 resize-none bg-gray-50"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-6">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-5 py-2 border rounded-md hover:bg-gray-50 transition disabled:opacity-60"
          >
            {generating ? "Generating..." : "Generate Email"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Apply;
