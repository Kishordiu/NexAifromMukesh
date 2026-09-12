import React, { useState, useEffect } from 'react';
import GlassSurface from '../../../components/ui/GlassSurface';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export function LabResultsEditor({ initialData, onSave, onCancel, isSaving }) {
 const [formData, setFormData] = useState({
 hemoglobin: '',
 glucose: '',
 systolic: '',
 diastolic: ''
 });

 useEffect(() => {
 if (initialData) {
 setFormData({
 hemoglobin: initialData.hemoglobin || '',
 glucose: initialData.glucose || '',
 systolic: initialData.systolic || '',
 diastolic: initialData.diastolic || ''
 });
 }
 }, [initialData]);

 const handleChange = (e) => {
 const { name, value } = e.target;
 setFormData(prev => ({ ...prev, [name]: value }));
 };

 const handleSubmit = (e) => {
 e.preventDefault();
 onSave(formData);
 };

 return (
 <GlassSurface level={3} className="p-6 rounded-3xl w-full max-w-md mx-auto">
 <h3 className="text-xl font-bold text-slate-800 mb-2">Review Extracted Data</h3>
 <p className="text-sm text-slate-500 mb-6">
 Please verify the values extracted from your report. You can correct any mistakes below.
 </p>

 <form onSubmit={handleSubmit} className="space-y-4">
 <Input
 label="Hemoglobin (g/dL)"
 name="hemoglobin"
 type="number"
 step="0.1"
 value={formData.hemoglobin}
 onChange={handleChange}
 placeholder="e.g. 12.5"
 />
 
 <Input
 label="Fasting Glucose (mg/dL)"
 name="glucose"
 type="number"
 value={formData.glucose}
 onChange={handleChange}
 placeholder="e.g. 95"
 />
 
 <div className="flex gap-4">
 <Input
 label="Systolic BP"
 name="systolic"
 type="number"
 value={formData.systolic}
 onChange={handleChange}
 placeholder="120"
 />
 <Input
 label="Diastolic BP"
 name="diastolic"
 type="number"
 value={formData.diastolic}
 onChange={handleChange}
 placeholder="80"
 />
 </div>

 <div className="pt-4 flex gap-3">
 <Button type="button" variant="secondary" className="flex-1 py-3" onClick={onCancel} disabled={isSaving}>
 Retake
 </Button>
 <Button type="submit" variant="primary" className="flex-1 py-3" isLoading={isSaving}>
 Save to Profile
 </Button>
 </div>
 </form>
 </GlassSurface>
 );
}
