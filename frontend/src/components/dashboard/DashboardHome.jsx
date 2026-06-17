function DashboardHome({ sessions, copyLink }) {
  const completed = sessions.filter((s) => s.Status === "Completed").length;

  const pending = sessions.filter((s) => s.Status === "Pending").length;

  const inProgress = sessions.filter((s) => s.Status === "In Progress").length;

  return (
    <>
      <h1
        className="mb-4"
        style={{
          color: "#f0f9ff",
        }}
      >
        Dashboard
      </h1>

      <div className="row mb-4">
        <StatCard title="Total Sessions" value={sessions.length} />

        <StatCard title="Completed" value={completed} />

        <StatCard title="Pending" value={pending} />

        <StatCard title="In Progress" value={inProgress} />
      </div>

      <div
        className="p-4"
        style={{
          background: "rgba(5,10,20,0.92)",
          border: "1px solid rgba(0,229,255,0.15)",
          borderRadius: "20px",
        }}
      >
        <h4
          className="mb-3"
          style={{
            color: "#7dd3fc",
          }}
        >
          Interview Sessions
        </h4>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Link</th>
                <th>Report</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session) => (
                <tr key={session.SessionId}>
                  <td>{session.CandidateName}</td>
                  <td>{session.CandidateEmail}</td>
                  <td>{session.CandidateRole}</td>
                  <td>{session.Status}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => copyLink(session.SessionId)}
                    >
                      Copy
                    </button>
                  </td>

                  <td>
                    {session.Status === "Completed" && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          window.open(`/report/${session.SessionId}`, "_blank")
                        }
                      >
                        Open
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="col-md-3 mb-3">
      <div
        className="p-4"
        style={{
          background: "rgba(5,10,20,0.92)",
          border: "1px solid rgba(0,229,255,0.15)",
          borderRadius: "20px",
        }}
      >
        <div
          style={{
            color: "#94a3b8",
          }}
        >
          {title}
        </div>

        <h2
          className="mt-2"
          style={{
            color: "#f0f9ff",
          }}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}

export default DashboardHome;
