import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';

export default function ReportsList() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await api.reports.list();
        setReports(data || []);
      } catch (e) {
        console.error("Failed to load reports", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const generateReport = async () => {
    try {
      setIsLoading(true);
      await api.reports.generate();
      const updated = await api.reports.list();
      setReports(updated || []);
    } catch (e) {
      alert("Failed to generate report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-8 pb-32 space-y-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Clinical Reports</h1>
          <p className="text-xs text-slate-500 font-medium">Verified Health Records</p>
        </div>
        <Button variant="primary" size="sm" onClick={generateReport} isLoading={isLoading}>
          Generate New
        </Button>
      </header>

      {isLoading && reports.length === 0 ? (
        <div className="text-center p-8"><span className="text-slate-400">Loading records...</span></div>
      ) : reports.length === 0 ? (
        <GlassSurface level={2} className="p-8 text-center rounded-3xl">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-slate-700 font-bold mb-1">No Reports Found</h3>
          <p className="text-sm text-slate-500">Generate a new clinical summary based on your recent vitals and scans.</p>
        </GlassSurface>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <GlassSurface 
              key={report.id} 
              level={2} 
              className="p-5 rounded-2xl flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate(`/reports/${report.id}`)}
              interactive
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${report.verified_by ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                  {report.verified_by ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{report.report_type}</h4>
                  <p className="text-xs text-slate-500">
                    {new Date(report.created_at).toLocaleDateString()} • {report.verified_by ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </GlassSurface>
          ))}
        </div>
      )}
    </div>
  );
}
