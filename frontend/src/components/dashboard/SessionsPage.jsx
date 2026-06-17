function SessionsPage({ form, setForm, handleCreate }) {
  const inputStyle = {
    background: "rgba(15,23,42,0.88)",
    border: "1px solid rgba(0,229,255,0.15)",
    color: "#e2e8f0",
    padding: "12px",
    borderRadius: "12px",
  };

  return (
    <div
      className="p-4"
      style={{
        background: "rgba(5,10,20,0.92)",
        border: "1px solid rgba(0,229,255,0.15)",
        borderRadius: "20px",
      }}
    >
      <h2
        className="mb-4"
        style={{
          color: "#7dd3fc",
        }}
      >
        Create Interview Session
      </h2>

      <form onSubmit={handleCreate}>
        <input
          className="form-control mb-3"
          placeholder="Candidate Name"
          value={form.candidate_name}
          onChange={(e) =>
            setForm({
              ...form,
              candidate_name: e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          className="form-control mb-3"
          placeholder="Candidate Email"
          value={form.candidate_email}
          onChange={(e) =>
            setForm({
              ...form,
              candidate_email: e.target.value,
            })
          }
          style={inputStyle}
        />

        <select
          className="form-select mb-3"
          value={form.candidate_role}
          onChange={(e) =>
            setForm({
              ...form,
              candidate_role: e.target.value,
            })
          }
          style={inputStyle}
        >
          <option>Backend Developer</option>
          <option>Frontend Developer</option>
          <option>Full Stack Developer</option>
          <option>DevOps Engineer</option>
          <option>QA Engineer</option>
          <option>Data Engineer</option>
        </select>

        <button className="btn btn-primary" type="submit">
          Generate Interview
        </button>
      </form>
    </div>
  );
}

export default SessionsPage;
