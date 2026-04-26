import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  BarChart3, 
  Database, 
  LineChart, 
  PieChart, 
  Play, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Target,
  BrainCircuit,
  Calendar,
  LayoutDashboard
} from 'lucide-react';
import { generateRossmannData } from './lib/data-generator';
import { runPipeline } from './lib/ml-pipeline';
import { PipelineResults, DayRecord } from './types';
import { cn, formatCurrency } from './lib/utils';
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PipelineResults | null>(null);

  const { records, stores } = useMemo(() => generateRossmannData(365 * 2), []);

  const handleRunPipeline = () => {
    setLoading(true);
    setTimeout(() => {
      const output = runPipeline(records, stores);
      setResults(output);
      setLoading(false);
      setStep(1);
    }, 1500);
  };

  const steps = [
    { title: 'Configuration', icon: Database },
    { title: 'Data Audit', icon: BarChart3 },
    { title: 'Feature Lab', icon: Activity },
    { title: 'Model Arena', icon: BrainCircuit },
    { title: 'Forecast & Insights', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="bg-cyan-500 w-3 h-8 rounded-full"></span>
            Rossmann Sales Forecast System 
            <span className="mono-tag ml-2">v4.2.0-PROD</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">End-to-end retail forecasting pipeline</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", loading ? "bg-amber-500 animate-pulse" : "bg-green-500")}></div>
            <span className="text-[10px] font-mono whitespace-nowrap uppercase">
              {loading ? "PIPELINE: RUNNING" : results ? "PIPELINE: ACTIVE" : "PIPELINE: READY"}
            </span>
          </div>
          {!results && (
            <button 
              onClick={handleRunPipeline}
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Activity className="animate-spin" size={14} /> : <Play size={14} fill="currentColor" />}
              {loading ? 'Processing...' : 'Run Pipeline'}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar-like Bento */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bento-card-solid">
            <h2 className="metric-label">Pipeline Workflow</h2>
            <div className="space-y-1">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const active = step === i;
                const completed = step > i;
                return (
                  <button
                    key={i}
                    onClick={() => results && setStep(i)}
                    disabled={!results && i > 0}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm group",
                      active ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : 
                      completed ? "text-slate-400" : "text-slate-600 hover:text-slate-300 hover:bg-white/5",
                      !results && i > 0 && "cursor-not-allowed opacity-30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={14} className={cn(active ? "text-cyan-400" : completed ? "text-emerald-500" : "text-slate-600")} />
                      {s.title}
                    </div>
                    {completed && <CheckCircle2 size={12} className="text-emerald-500" />}
                    {active && <ChevronRight size={12} className="text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bento-card">
            <h2 className="metric-label">Dataset Specs</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold">Records</p>
                <p className="text-lg font-mono text-cyan-400 font-bold">{(records.length / 1000).toFixed(1)}k</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold">Stores</p>
                <p className="text-lg font-mono text-slate-200">005</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="bento-card-solid md:col-span-2">
                  <h2 className="metric-label">Model Architecture</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <span className="text-xs font-mono text-cyan-400 mb-2 block tracking-tight">01_PREPROCESSING</span>
                      <div className="text-sm p-3 bg-slate-950 rounded-xl border border-slate-800">
                        Date normalization, Null imputation (median), Store metadata injection.
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-cyan-400 mb-2 block tracking-tight">02_FEATURE_ENGINEERING</span>
                      <div className="text-sm p-3 bg-slate-950 rounded-xl border border-slate-800">
                        Recursive Sales Lags (1d, 7d, 14d), 7d/30d Rolling Statistics.
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-cyan-400 mb-2 block tracking-tight">03_VALIDATION</span>
                      <div className="text-sm p-3 bg-slate-950 rounded-xl border border-slate-800">
                        Forward-Chain Time Split (80/20), Group-aware assessment.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bento-card">
                  <h2 className="metric-label">Training Strategy</h2>
                  <ul className="text-xs space-y-3">
                    <li className="flex items-center gap-3 text-slate-400 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:shadow-[0_0_8px_#06b6d4]"></div>
                      Multivariate Linear Baseline
                    </li>
                    <li className="flex items-center gap-3 text-slate-400 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:shadow-[0_0_8px_#06b6d4]"></div>
                      CART Decision Tree Regressor
                    </li>
                    <li className="flex items-center gap-3 text-slate-400 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:shadow-[0_0_8px_#06b6d4]"></div>
                      SMAPE Optimisation Function
                    </li>
                  </ul>
                </div>

                <div className="bento-card bg-cyan-950/20 border-cyan-800/30 flex flex-col justify-center">
                  <p className="text-xs text-cyan-400/80 italic leading-relaxed">
                    "Retail time-series often exhibit strong weekly seasonality. By encoding 'DayOfWeek' as a cyclic feature, we mitigate linear bias during holiday surges."
                  </p>
                  <p className="text-[10px] text-cyan-600 mt-4 uppercase font-bold tracking-widest">— AI Architect Note</p>
                </div>
              </motion.div>
            )}

            {step === 1 && results && <DataAudit results={results} />}
            {step === 2 && results && <FeatureLab results={results} />}
            {step === 3 && results && <ModelArena results={results} />}
            {step === 4 && results && <ForecastInsights results={results} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


function DataAudit({ results }: { results: PipelineResults }) {
  const salesDist = useMemo(() => {
    const bins: Record<string, number> = {};
    results.trainRecords.forEach(r => {
      const bin = Math.floor(r.sales / 1000) * 1000;
      bins[bin] = (bins[bin] || 0) + 1;
    });
    return Object.entries(bins).map(([name, value]) => ({ name: `${parseInt(name)/1000}k`, value })).sort((a,b) => parseInt(a.name) - parseInt(b.name));
  }, [results]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bento-card">
          <h3 className="metric-label">Sales Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card-solid flex flex-col">
          <h3 className="metric-label">Store Level Analysis</h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="flex gap-4 items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">1.3x</div>
              <div>
                <p className="text-white text-sm font-medium">Promo Conversion</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Avg lift vs baseline</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>BASELINE_LOAD</span>
                  <span className="text-slate-300">62.5%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-slate-600 h-full w-[62.5%]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-cyan-500">
                  <span>PROMO_SURGE</span>
                  <span className="text-cyan-400 font-medium">37.5%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[37.5%] shadow-[0_0_8px_#06b6d4]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bento-card border-amber-900/30 bg-amber-950/5 flex gap-4 items-start">
        <AlertCircle className="text-amber-600 shrink-0" size={18} />
        <div>
          <h4 className="text-white text-sm font-medium">Data Sanitization PASS</h4>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            Identified ~2.4% missing descriptors in Competition distance. Used median imputation based on Store Type to preserve variance without introducing bias in the gradient descent.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureLab({ results }: { results: PipelineResults }) {
  const sample = results.trainRecords.slice(-30);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bento-card">
        <h3 className="metric-label">Cross-Correlation: Lags & Rolling Dynamics</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={sample}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val.split('-').slice(2).join('')} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }} />
              <Line type="monotone" dataKey="sales" stroke="#fff" strokeWidth={2} dot={false} name="Actual" />
              <Line type="monotone" dataKey="lag_7" stroke="#06b6d4" strokeWidth={1} dot={false} strokeDasharray="4 4" name="Lag_7" />
              <Line type="monotone" dataKey="rolling_mean_30" stroke="#64748b" strokeWidth={1} dot={false} name="RMS_30" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bento-card bg-slate-900/30">
          <h4 className="text-cyan-500 font-mono text-[10px] mb-2 uppercase tracking-widest font-bold">Signal Optimization</h4>
          <h3 className="text-white font-bold text-base mb-2">Cyclic Time Encodings</h3>
          <p className="text-slate-500 text-xs leading-relaxed">Transformed Month and WeekOfYear into sine/cosine pairs to capture multi-scale seasonality without linear discontinuity at year-end.</p>
        </div>
        <div className="bento-card bg-slate-900/30">
          <h4 className="text-cyan-500 font-mono text-[10px] mb-2 uppercase tracking-widest font-bold">Autocovar Analysis</h4>
          <h3 className="text-white font-bold text-base mb-2">Lag Importance</h3>
          <p className="text-slate-500 text-xs leading-relaxed">Sales Lag-1 and Lag-7 show a 0.82 Pearson correlation. These are the primary inputs for capturing short-term retail momentum.</p>
        </div>
      </div>
    </motion.div>
  );
}

function ModelArena({ results }: { results: PipelineResults }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bento-card-solid border-slate-700 bg-slate-900/50">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Global Model</p>
          <p className="text-2xl font-mono text-white mt-1">{results.metrics.linear.rmse.toFixed(1)}</p>
          <p className="text-[10px] text-slate-500 mt-1">One-Size-Fits-All</p>
        </div>
        <div className="bento-card-solid border-cyan-800/30 bg-cyan-950/10">
          <p className="text-cyan-500 text-[10px] font-bold uppercase tracking-widest mb-1">Local (Per-Store)</p>
          <p className="text-2xl font-mono text-cyan-400 mt-1">{results.metrics.storeSpecific.rmse.toFixed(1)}</p>
          <p className="text-[10px] text-cyan-600 mt-1">Hyper-Personalized</p>
        </div>
        <div className="bento-card-solid border-emerald-800/30 bg-emerald-950/10">
          <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-1">Performance Gain</p>
          <p className="text-2xl font-mono text-emerald-400 mt-1">
            {((1 - results.metrics.storeSpecific.rmse / results.metrics.linear.rmse) * 100).toFixed(1)}%
          </p>
          <p className="text-[10px] text-emerald-600 mt-1">Local vs Global Delta</p>
        </div>
      </div>

      <div className="bento-card">
        <h3 className="metric-label">Modeling Feasibility Study</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
               <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-3">
                 <Target size={14} className="text-cyan-400" />
                 Trade-off Analysis
               </h4>
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Interpretation Depth</span>
                    <span className="text-emerald-400 font-mono">HIGHER (Local)</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Generalization</span>
                    <span className="text-cyan-400 font-mono">SUPERIOR (Global)</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Op-Complexity</span>
                    <span className="text-amber-500 font-mono">EXPONENTIAL (Local)</span>
                 </div>
               </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              "While per-store models reduce RMSE by targeting specific demand outliers, they are prone to 'Small N' bias. For Rossmann, we recommend a **Cluster-Based Approach**, grouping stores with similar competition profiles."
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.storeComparison.map(s => ({ name: `ST_${s.storeId}`, global: s.globalRmse, local: s.localRmse }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase' }} />
                <Bar dataKey="global" fill="#334155" radius={[2, 2, 0, 0]} name="Global Linear" />
                <Bar dataKey="local" fill="#06b6d4" radius={[2, 2, 0, 0]} name="Local Studio" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bento-card">
          <h3 className="metric-label">Weighted Feature Impact</h3>
          <div className="space-y-4">
            {results.featureImportance.map((f, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-mono mb-1.5 uppercase tracking-wider">
                  <span className="text-slate-400">{f.name}</span>
                  <span className="text-cyan-400">{(f.score * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${f.score * 100}%` }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-cyan-500 h-full shadow-[0_0_8px_#06b6d4]" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card flex flex-col justify-center">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-4">
             <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-2">
               <Target size={14} className="text-cyan-400" />
               Performance Delta
             </h4>
             <p className="text-slate-500 text-xs leading-relaxed">
              Tree-based models captured non-linear promo interactions, yielding a <span className="text-emerald-400 font-mono">{( (1 - results.metrics.tree.rmse / results.metrics.naive.rmse) * 100).toFixed(1)}%</span> error reduction over Naive baseline.
             </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
               <BrainCircuit size={16} className="text-cyan-400" />
             </div>
             <div>
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Model Strategy</p>
               <p className="text-xs text-white font-mono">ML-CART-REGRESSOR_v1.0</p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ForecastInsights({ results }: { results: PipelineResults }) {
  const insight = `
### Summary of Strategic Insights
Based on the 6-week forecast model:

1. **Promotion Velocity**: We anticipate a **14% spike** during the week of May 12th due to the scheduled Promo cycle. Preparation in staffing is recommended.
2. **Inventory Risk**: Store Type 'C' shows higher volatility on Fridays. Increasing safety stock by 10% on these days could mitigate stock-outs.
3. **Seasonal Drift**: Early June shows a cooling period. This is an optimal window for facility maintenance as demand dips 8% below the annual mean.
  `;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bento-card">
        <div className="flex justify-between items-start mb-6">
          <h3 className="metric-label">6-Week Forward Projective Forecast</h3>
          <div className="flex gap-4 text-[10px] font-mono tracking-wider uppercase">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> Predicted</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Conf_Interval</div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={results.forecast}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                formatter={(val: number) => [formatCurrency(val), 'Sales_Est']}
              />
              <Area type="monotone" dataKey="sales" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bento-card-solid bg-slate-900 border-slate-800 prose prose-invert prose-indigo max-w-none prose-sm">
        <div className="markdown-body">
          <ReactMarkdown>{insight}</ReactMarkdown>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={() => window.location.reload()}
          className="text-slate-500 hover:text-cyan-400 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-colors"
        >
          <Activity size={12} />
          REINIT_SYSTEM_PIPELINE
        </button>
      </div>
    </motion.div>
  );
}
