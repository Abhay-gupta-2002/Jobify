import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  uploadResume,
  uploadPhoto,
  updateEmailKey,
  updateName,
} from "../api/user.api";

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [emailKey, setEmailKey] = useState("");
  const [resume, setResume] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data.user);
      setEmailKey(res.data.user.emailKey || "");
      setName(res.data.user.name || "");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= UPDATE NAME =================
  const handleSaveName = async () => {
    if (!name) return alert("Name cannot be empty");
    try {
      await updateName(name);
      await fetchProfile();
      alert("Name updated");
    } catch {
      alert("Failed to update name");
    }
  };

  // ================= UPDATE EMAIL KEY =================
  const handleSaveEmailKey = async () => {
    try {
      await updateEmailKey(emailKey);
      alert("Email key saved");
    } catch {
      alert("Failed to save email key");
    }
  };

  // ================= UPLOAD RESUME =================
  const handleSaveResume = async () => {
    if (!resume) return;
    try {
      await uploadResume(resume);
      await fetchProfile();
      setResume(null);
      alert("Resume uploaded");
    } catch {
      alert("Resume upload failed");
    }
  };

  // ================= UPLOAD PHOTO =================
  const handleSavePhoto = async () => {
    if (!photo) return;
    try {
      await uploadPhoto(photo);
      await fetchProfile();
      setPhoto(null);
      alert("Photo updated");
    } catch {
      alert("Photo upload failed");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-slate-400 mt-20">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 space-y-10">

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex gap-6 items-center">
        <div className="w-24 h-24 rounded-full border border-white/10 overflow-hidden">
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              className="w-full h-full object-cover"
            />
          ) : user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              Photo
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white"
            />
            <button
              onClick={handleSaveName}
              className="bg-white text-black px-4 py-2 rounded-xl"
            >
              Save
            </button>
          </div>

          <p className="text-sm text-slate-400">{user.email}</p>

          <div className="flex gap-4 text-sm">
            <label className="text-blue-400 underline cursor-pointer">
              Change Photo
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="hidden"
              />
            </label>

            {photo && (
              <button
                onClick={handleSavePhoto}
                className="bg-white text-black px-3 py-1.5 rounded-lg"
              >
                Save Photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= EMAIL KEY ================= */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Email Credentials
        </h3>

        <div className="flex gap-4">
          <input
            type="password"
            value={emailKey}
            onChange={(e) => setEmailKey(e.target.value)}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white"
          />
          <button
            onClick={handleSaveEmailKey}
            className="bg-white text-black px-6 rounded-xl"
          >
            Save
          </button>
        </div>
      </div>

      {/* ================= RESUME ================= */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Resume
        </h3>

        {resume ? (
          <p className="text-sm text-slate-300 mb-2">
            Selected: <b>{resume.name}</b>
          </p>
        ) : user?.resume ? (
          <a
            href={user.resume}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-400 underline mb-2 inline-block"
          >
            View Resume
          </a>
        ) : (
          <p className="text-sm text-slate-400 mb-2">
            No resume uploaded
          </p>
        )}

        <div className="flex flex-wrap gap-4 items-center">
          <label className="text-blue-400 underline cursor-pointer text-sm">
            Upload Resume
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="hidden"
            />
          </label>

          {resume && (
            <button
              onClick={handleSaveResume}
              className="bg-white text-black px-4 py-2 rounded-xl"
            >
              Save Resume
            </button>
          )}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="text-right">
        <button
          onClick={() => navigate("/apply")}
          className="bg-white text-black px-6 py-3 rounded-xl hover:bg-slate-200 transition"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default Profile;
