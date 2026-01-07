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

  useEffect(() => {
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
    fetchProfile();
  }, []);

  const handleSaveEmailKey = async () => {
    try {
      await updateEmailKey(emailKey);
      alert("Email key saved");
    } catch {
      alert("Failed to save email key");
    }
  };

  const handleSaveName = async () => {
    if (!name) {
      alert("Name cannot be empty");
      return;
    }
    try {
      const res = await updateName(name);
      setUser(res.data.user);
      alert("Name updated");
    } catch {
      alert("Failed to update name");
    }
  };

  const handleSaveResume = async () => {
    try {
      await uploadResume(resume);
      alert("Resume uploaded");
    } catch {
      alert("Resume upload failed");
    }
  };

  const handlePhotoChange = async (file) => {
    setPhoto(file);
    try {
      await uploadPhoto(file);
    } catch {
      alert("Photo upload failed");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-20">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* PROFILE CARD */}
      <div className="bg-white border rounded-2xl p-6 flex gap-6 items-center shadow-sm">
        <div className="w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center">
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : user?.profilePhoto ? (
            <img
              src={`http://localhost:5000/${user.profilePhoto}`}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">Photo</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm"
            />
            <button
              onClick={handleSaveName}
              className="bg-black text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-800"
            >
              Save
            </button>
          </div>

          <p className="text-sm text-gray-500">{user?.email}</p>

          <label className="text-sm text-blue-600 underline cursor-pointer">
            Change Photo
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handlePhotoChange(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* EMAIL KEY */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-1">
          Email Credentials
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Used to send emails on your behalf
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="password"
            value={emailKey}
            onChange={(e) => setEmailKey(e.target.value)}
            placeholder="Enter email app password"
            className="flex-1 border rounded-md px-3 py-2"
          />
          <button
            onClick={handleSaveEmailKey}
            className="bg-black text-white px-6 rounded-md hover:bg-gray-800"
          >
            Save
          </button>
        </div>

        <div className="mt-4 text-right">
          <button
            className="text-sm text-red-500 underline"
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=m8Ur2SoVKEs",
                "_blank"
              )
            }
          >
            How to generate email passkey?
          </button>
        </div>
      </div>

      {/* RESUME */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Resume</h3>

        {resume ? (
          <p className="text-sm text-gray-700 mb-2">
            Selected: <b>{resume.name}</b>
          </p>
        ) : user?.resume ? (
          <p className="text-sm text-green-600 mb-2">
            Resume uploaded
          </p>
        ) : (
          <p className="text-sm text-gray-500 mb-2">
            No resume uploaded
          </p>
        )}

        <div className="flex flex-wrap gap-4 items-center">
          <label className="text-sm text-blue-600 underline cursor-pointer">
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
              className="bg-black text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-800"
            >
              Save Resume
            </button>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="text-right">
        <button
          onClick={() => navigate("/apply")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default Profile;
