import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailList from "../components/emails/EmailList";
import { getApplications } from "../api/application";

function Home() {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getApplications();
        setEmails(res.data.applications);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Applications
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your job applications
          </p>
        </div>

        <button
          onClick={() => navigate("/apply")}
          className="bg-white text-black px-6 py-3 rounded-xl hover:bg-slate-200 transition"
        >
          Apply Now
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <EmailList emails={emails} />
        )}
      </div>
    </div>
  );
}

export default Home;
