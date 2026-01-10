function EmailList({ emails }) {
  if (!emails || emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-56 text-center
      bg-white/5 rounded-2xl border border-white/10">
        <p className="text-white font-medium">
          No applications yet
        </p>
        <p className="text-sm text-slate-400 mt-1">
          Start applying to see your history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {emails.map((item) => (
        <div
          key={item._id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between
          gap-4 rounded-2xl border border-white/10 bg-white/5 p-5
          hover:bg-white/10 transition-all shadow-sm"
        >
          {/* LEFT */}
          <div>
            <p className="font-medium text-white">
              {item.company}
            </p>
            <p className="text-sm text-slate-400">
              {item.email}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2">
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                item.status === "Sent"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {item.status}
            </span>

            <p className="text-xs text-slate-500">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmailList;
