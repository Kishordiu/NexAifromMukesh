import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.reports.get(id);
        setReport(data);
      } catch (e) {
        console.error("Failed to load report", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center"><span className="text-slate-400">Loading document...</span></div>;
  }

  if (!report) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 mb-4">Report not found.</p>
        <Button onClick={() => navigate('/reports')}>Back to Reports</Button>
      </div>
    );
  }

  const parsedData = report.parsed_data ? JSON.parse(report.parsed_data) : null;

  return (
    <div className="pt-8 pb-32 space-y-6">
      <header className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/reports')} className="p-2 bg-white/50 rounded-full shadow-sm">
          <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{report.report_type}</h1>
          <p className="text-xs text-slate-500 font-medium">
            {new Date(report.created_at).toLocaleString()}
          </p>
        </div>
      </header>

      <GlassSurface level={3} className="p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status</span>
          {report.verified_by ? (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
              Verified by Dr. {report.verified_by}
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
              Pending Clinical Verification
            </span>
          )}
        </div>

        {report.summary && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Clinical Summary</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-white/50 p-4 rounded-xl">
              {report.summary}
            </p>
          </div>
        )}

        {parsedData && (
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Extracted Data</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(parsedData).map(([key, value]) => (
                <div key={key} className="bg-white/40 p-3 rounded-lg">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{key}</p>
                  <p className="text-sm font-semibold text-slate-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.raw_text && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Raw OCR Text</h3>
            <pre className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {report.raw_text}
            </pre>
          </div>
        )}
      </GlassSurface>
    </div>
  );
}
