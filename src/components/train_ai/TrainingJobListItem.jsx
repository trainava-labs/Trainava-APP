import React from 'react';
import { List, Zap, Hourglass, CheckCircle, XCircle } from 'lucide-react';

const TrainingJobListItem = ({ job }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'queued':
        return <Hourglass className="h-4 w-4 text-yellow-400" />;
      case 'running':
        return <Zap className="h-4 w-4 text-blue-400 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <List className="h-4 w-4 text-slate-400" />;
    }
  };

  const jobDisplayName = job.job_config?.jobName || job.pipeline_name || 'Unnamed Job';

  return (
    <div className="p-3 border border-slate-700 rounded-md bg-slate-800 hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-slate-200">{jobDisplayName}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 capitalize bg-opacity-20
          ${job.status === 'completed' ? 'bg-green-500 text-green-300' : 
            job.status === 'running' ? 'bg-blue-500 text-blue-300' :
            job.status === 'failed' || job.status === 'cancelled' ? 'bg-red-500 text-red-300' :
            'bg-yellow-500 text-yellow-300' // pending, queued
          }`}
        >
          {getStatusIcon(job.status)} {job.status ? job.status.replace(/-/g, ' ') : 'Unknown'}
        </span>
      </div>
      <p className="text-xs text-slate-500">ID: {job.id}</p>
      <p className="text-xs text-slate-400 mt-1">Pipeline: {job.pipeline_name}</p>
      <p className="text-xs text-slate-400 mt-1">Created: {new Date(job.created_at).toLocaleString()}</p>
      {job.status === 'running' && <p className="text-xs text-blue-400">Progress: {job.progress || 0}%</p>}
      {job.gpu_id_used && <p className="text-xs text-slate-500 mt-1">Using Owned GPU ID: {job.gpu_id_used.slice(-8)}...</p>}
      {job.rented_gpu_id && <p className="text-xs text-slate-500 mt-1">Using Rented GPU ID: {job.rented_gpu_id.slice(-8)}...</p>}
    </div>
  );
};

export default TrainingJobListItem;