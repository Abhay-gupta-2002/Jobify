import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  disconnectGmail,
  getGoogleConnectUrl,
  getProfile,
  updateName,
  uploadPhoto,
  uploadResume,
} from "../api/user.api";

const gmailStatusMessages = {
  connected: "Gmail connected successfully. You can now send applications.",
  error: "Google connection failed. Please try again.",
  "missing-refresh-token":
    "Google did not return offline access. Disconnect and connect again.",
  "user-not-found": "We could not match the Google callback to your account.",
};

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [resume, setResume] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gmailBusy, setGmailBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data.user);
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gmailStatus = params.get("gmail");

    if (gmailStatus && gmailStatusMessages[gmailStatus]) {
      setStatusMessage(gmailStatusMessages[gmailStatus]);
      fetchProfile();
      navigate("/profile", { replace: true });
    }
  }, [location.search, navigate]);

  const handleSaveName = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    try {
      await updateName(name);
      await fetchProfile();
      alert("Name updated");
    } catch {
      alert("Failed to update name");
    }
  };

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

  const handleConnectGmail = async () => {
    setGmailBusy(true);

    try {
      const res = await getGoogleConnectUrl();
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.error || "Failed to start Google connection");
      setGmailBusy(false);
    }
  };

  const handleDisconnectGmail = async () => {
    setGmailBusy(true);

    try {
      await disconnectGmail();
      await fetchProfile();
      setStatusMessage("Gmail disconnected.");
    } catch {
      alert("Failed to disconnect Gmail");
    } finally {
      setGmailBusy(false);
    }
  };

  if (loading) {
    return <p className="mt-20 text-center text-slate-400">Loading profile...</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 py-12">
      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
          {statusMessage}
        </div>
      ) : null}

      <div className="flex items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="h-24 w-24 overflow-hidden rounded-full border border-white/10">
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              className="h-full w-full object-cover"
            />
          ) : user?.profilePhoto ? (
            <img src={user.profilePhoto} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500">
              Photo
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
            />
            <button
              onClick={handleSaveName}
              className="rounded-xl bg-white px-4 py-2 text-black"
            >
              Save
            </button>
          </div>

          <p className="text-sm text-slate-400">{user.email}</p>

          <div className="flex gap-4 text-sm">
            <label className="cursor-pointer text-blue-400 underline">
              Change Photo
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="hidden"
              />
            </label>

            {photo ? (
              <button
                onClick={handleSavePhoto}
                className="rounded-lg bg-white px-3 py-1.5 text-black"
              >
                Save Photo
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h3 className="mb-4 text-lg font-semibold text-white">Gmail Sending</h3>
        <p className="mb-4 text-sm text-slate-400">
          Connect the Gmail account that should send your cold emails. After
          permission is granted, Jobify can send applications directly from that
          Gmail account.
        </p>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-slate-300">
            Status:{" "}
            <span className={user?.gmailConnected ? "text-emerald-300" : "text-amber-300"}>
              {user?.gmailConnected ? "Connected" : "Not connected"}
            </span>
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {user?.gmailConnected && user?.gmailEmail
              ? `Connected Gmail: ${user.gmailEmail}`
              : "No Gmail account connected yet."}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handleConnectGmail}
              disabled={gmailBusy}
              className="rounded-xl bg-white px-5 py-2.5 text-black disabled:opacity-60"
            >
              {gmailBusy ? "Opening Google..." : user?.gmailConnected ? "Reconnect Gmail" : "Connect Gmail"}
            </button>

            {user?.gmailConnected ? (
              <button
                onClick={handleDisconnectGmail}
                disabled={gmailBusy}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-white disabled:opacity-60"
              >
                Disconnect
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h3 className="mb-4 text-lg font-semibold text-white">Resume</h3>

        {resume ? (
          <p className="mb-2 text-sm text-slate-300">
            Selected: <b>{resume.name}</b>
          </p>
        ) : user?.resume ? (
          <a
            href={user.resume}
            target="_blank"
            rel="noreferrer"
            className="mb-2 inline-block text-sm text-blue-400 underline"
          >
            View Resume
          </a>
        ) : (
          <p className="mb-2 text-sm text-slate-400">No resume uploaded</p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <label className="cursor-pointer text-sm text-blue-400 underline">
            Upload Resume
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="hidden"
            />
          </label>

          {resume ? (
            <button
              onClick={handleSaveResume}
              className="rounded-xl bg-white px-4 py-2 text-black"
            >
              Save Resume
            </button>
          ) : null}
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={() => navigate("/apply")}
          className="rounded-xl bg-white px-6 py-3 text-black transition hover:bg-slate-200"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default Profile;
