import React, { useState } from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Server,
  Cloud,
  FileCode,
  Download,
  Upload
} from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testSupabaseConnection,
  generateSupabaseSchemaSQL
} from '../services/supabaseClient';

export default function SupabaseConfigModal() {
  const { isSupabaseModalOpen, setIsSupabaseModalOpen, resetDemo } = useCareNest();

  const [creds, setCreds] = useState(() => getSupabaseCredentials());
  const [urlInput, setUrlInput] = useState(creds.url);
  const [keyInput, setKeyInput] = useState(creds.key);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'sql'
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isSupabaseModalOpen) return null;

  const handleTestConnection = async () => {
    if (!urlInput.trim() || !keyInput.trim()) {
      setTestResult({ success: false, message: 'Please provide both Supabase URL and Anon Key.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const result = await testSupabaseConnection(urlInput, keyInput);
    setIsTesting(false);
    setTestResult(result);
  };

  const handleSave = () => {
    saveSupabaseCredentials(urlInput, keyInput);
    setCreds(getSupabaseCredentials());
    setTestResult({ success: true, message: 'Credentials saved! Application will sync with Supabase.' });
  };

  const handleClear = () => {
    saveSupabaseCredentials('', '');
    setUrlInput('');
    setKeyInput('');
    setCreds(getSupabaseCredentials());
    setTestResult({ success: true, message: 'Switched to Local Demo Mode (localStorage).' });
  };

  const sqlScript = generateSupabaseSchemaSQL();

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-soft-xl max-h-[90vh] overflow-y-auto border border-stone-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Database className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-stone-900">Database & Cloud Persistence</h2>
              <p className="text-xs text-stone-500 font-medium">
                Seamless hybrid storage: Supabase PostgreSQL + Offline LocalStorage
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSupabaseModalOpen(false)}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Pill */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
          creds.isConfigured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-stone-50 border-stone-200 text-stone-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${creds.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider">
                {creds.isConfigured ? 'Supabase Connected' : 'Local Demo Mode Active (localStorage)'}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                {creds.isConfigured
                  ? 'All medication schedules and care logs sync to your Supabase PostgreSQL project.'
                  : 'Running locally without credentials. Full CRUD works persistently in your browser.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-sage-600 text-white shadow-soft-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'bg-sage-600 text-white shadow-soft-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Supabase SQL Schema</span>
          </button>
        </div>

        {/* Tab 1: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://your-project-id.supabase.co"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Supabase Public Anon Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-coral-50 text-coral-800 border border-coral-200'
                }`}
              >
                {testResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2.5 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-semibold"
                >
                  Use Local Mode Only
                </button>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-bold shadow-md shadow-sage-600/20"
              >
                Save & Connect
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: SQL Script */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-600 font-medium">
                Copy and run this SQL script in your <strong>Supabase Project → SQL Editor</strong> to automatically create all required tables, foreign keys, and RLS policies:
              </p>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 transition-colors flex-shrink-0"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-stone-900 text-stone-100 text-[11px] font-mono overflow-x-auto max-h-72 border border-stone-800 leading-relaxed">
              {sqlScript}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
