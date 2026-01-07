function EmailList({ emails }) {
  if (!emails || emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-56 text-center bg-gray-50 rounded-xl border">
        <p className="text-gray-600 font-medium">
          No applications yet
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Start applying to see your history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {emails.map((item) => (
        <div
          key={item._id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                     gap-3 rounded-xl border bg-white p-4 shadow-sm
                     hover:shadow transition"
        >
          {/* LEFT */}
          <div>
            <p className="font-semibold text-gray-900">
              {item.company}
            </p>
            <p className="text-sm text-gray-500">
              {item.email}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2">
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                item.status === "Sent"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.status}
            </span>

            <p className="text-xs text-gray-400">
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
