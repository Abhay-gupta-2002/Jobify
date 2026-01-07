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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Recent Applications
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and manage your job applications
          </p>
        </div>

        <button
          onClick={() => navigate("/apply")}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Apply Now
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        {loading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : emails.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No applications yet. Start applying now.
          </p>
        ) : (
          <EmailList emails={emails} />
        )}
      </div>
    </div>
  );
}

export default Home;
