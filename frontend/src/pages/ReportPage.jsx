import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ReportPage() {
  const { sessionId } = useParams();

  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/report-data/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("REPORT DATA:", data);
        setReport(data);
      })
      .catch(console.error);
  }, [sessionId]);

  if (!report) {
    return <div className="p-4">Loading...</div>;
  }
  if (report.error) {
    return (
      <div className="p-4 text-light">
        <h3>{report.error}</h3>
      </div>
    );
  }

  return (
    <div className="container py-4 text-light">
      <h2>Evaluation Report</h2>

      <hr />

      <p>
        <strong>Overall Score:</strong> {report.overall_score}/100
      </p>

      <p>
        <strong>Communication:</strong> {report.communication}/10
      </p>

      <p>
        <strong>Confidence:</strong> {report.confidence}/10
      </p>

      <p>
        <strong>Technical Reasoning:</strong> {report.technical_reasoning}/10
      </p>

      <p>
        <strong>Ownership:</strong> {report.ownership}/10
      </p>

      <p>
        <strong>Problem Solving:</strong> {report.problem_solving}/10
      </p>

      <p>
        <strong>Professionalism:</strong> {report.professionalism}/10
      </p>

      <h4>Strengths</h4>

      <ul>
        {report.strengths.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h4>Areas for Improvement</h4>

      <ul>
        {report.improvements.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h4>Summary</h4>

      <p>{report.summary}</p>

      <a
        href={`http://127.0.0.1:8000/report/${sessionId}`}
        target="_blank"
        rel="noreferrer"
      >
        Download PDF Report
      </a>
    </div>
  );
}

export default ReportPage;
