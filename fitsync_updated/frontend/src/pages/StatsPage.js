import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Cell,
} from 'recharts';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';

const TABS = ['Day', 'Week', 'Month'];

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Week');

  useEffect(() => {
    Promise.all([api.get('/progress/stats'), api.get('/tracking/today')])
      .then(([s, t]) => { setStats(s.data); setTracking(t.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
      <span className="spinner" />
    </div>
  );

  const chartData = tab === 'Month'
    ? (stats?.monthlyPerformance || [])
    : (stats?.weeklyPerformance || []);

  const hasData = chartData.some(d => (d.duration || 0) > 0);
  const weeklyAvg = stats?.weeklyAvgMinutes ?? 46.4;
  const water = tracking?.waterIntake ?? 2.5;
  const steps = tracking?.steps ?? 8200;

  const metrics = [
    { label:'Total Workouts', value: stats?.totalWorkouts ?? 0 },
    { label:'Calories Burned', value: (stats?.totalCaloriesBurned ?? 0).toLocaleString(), unit:'kcal' },
    { label:'Current Streak', value: stats?.currentStreak ?? 0, unit:'days' },
    { label:'This Week', value: `${stats?.weeklyWorkoutsDone ?? 0}/4`, unit:'done' },
  ];

  return (
    <div className="page fade-up" style={{ paddingTop: 0 }}>
      <TopNav />
      <div style={{ padding:'20px 20px 0' }}>
        <h2 style={styles.title}>Statistics</h2>

        {/* Day/Week/Month tabs */}
        <div style={styles.tabRow}>
          {TABS.map(t => (
            <button
              key={t}
              style={{ ...styles.tabBtn, ...(tab === t ? styles.tabActive : {}) }}
              onClick={() => setTab(t)}
            >{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:'0 20px', paddingBottom:'calc(var(--nav-h) + 24px)' }}>
        {/* Workout Duration chart card */}
        <div className="card" style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <p style={styles.chartTitle}>Workout Duration</p>
              <p style={styles.chartSub}>{tab.toUpperCase()} PERFORMANCE (MIN)</p>
            </div>
            <div style={styles.activeBadge}>● ACTIVE</div>
          </div>

          {hasData ? (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData} margin={{ top:8, right:0, left:-28, bottom:0 }}>
                <defs>
                  <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill:'var(--text3)', fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'var(--text3)', fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }}
                  labelStyle={{ color:'var(--text2)' }}
                  itemStyle={{ color:'var(--accent)' }}
                  formatter={(val) => [`${val} min`, 'Duration']}
                />
                <Area type="monotone" dataKey="duration" stroke="var(--accent)" strokeWidth={2.5} fill="url(#dg)" dot={{ fill:'var(--accent)', r:4 }} activeDot={{ r:6 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={styles.emptyChart}>
              <p>Complete workouts to see your performance chart 💪</p>
            </div>
          )}

          <div style={styles.avgRow}>
            <div>
              <p style={styles.avgLabel}>WEEKLY AVG</p>
              <p style={styles.avgVal}>{weeklyAvg} <span style={styles.avgUnit}>MIN / DAY</span></p>
            </div>
            <div style={styles.perfBadge}>↑ 12.5% PERFORMANCE</div>
          </div>
        </div>

        {/* Water + Steps quick tiles */}
        <div style={styles.twoCol}>
          <div className="card" style={styles.miniCard}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10"/></svg>
            <p style={styles.miniLabel}>Water</p>
            <p style={styles.miniVal}>{water.toFixed(1)}L</p>
          </div>
          <div className="card" style={styles.miniCard}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <p style={styles.miniLabel}>Steps</p>
            <p style={styles.miniVal}>{(steps/1000).toFixed(1)}K</p>
          </div>
        </div>

        {/* Metric grid */}
        <div style={styles.grid}>
          {metrics.map((m, i) => (
            <div key={i} className="card" style={styles.metricCard}>
              <p style={styles.metricVal}>{m.value}<span style={styles.metricUnit}>{m.unit ? ` ${m.unit}` : ''}</span></p>
              <p style={styles.metricLabel}>{m.label}</p>
            </div>
          ))}
        </div>

        {/* Goals section */}
        <div className="card" style={{ marginTop:12 }}>
          <p style={styles.goalsTitle}>Goals</p>
          {[
            ['Current Weight', `${stats?.currentWeight ?? '--'} kg`],
            ['Target Weight', `${stats?.targetWeight ?? '--'} kg`],
            ['Daily Calorie Goal', `${(stats?.dailyCalorieGoal ?? 0).toLocaleString()} kcal`],
            ['Daily Protein Goal', `${stats?.dailyProteinGoal ?? '--'}g`],
          ].map(([label, val], i, arr) => (
            <React.Fragment key={label}>
              <div style={styles.goalRow}>
                <span style={styles.goalLabel}>{label}</span>
                <span style={styles.goalVal}>{val}</span>
              </div>
              {i < arr.length - 1 && <div style={styles.goalDiv}/>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

const styles = {
  title: { fontSize:26, fontWeight:700, letterSpacing:'-0.3px', marginBottom:16 },
  tabRow: { display:'flex', gap:4, marginBottom:16 },
  tabBtn: { padding:'7px 16px', borderRadius:100, background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text3)', fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.15s' },
  tabActive: { background:'var(--accent)', color:'#0e0e12', border:'1px solid var(--accent)', fontWeight:700 },
  chartCard: { marginBottom:12 },
  chartHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 },
  chartTitle: { fontSize:16, fontWeight:700 },
  chartSub: { fontSize:10, color:'var(--text3)', letterSpacing:'0.8px', marginTop:2 },
  activeBadge: { fontSize:10, color:'var(--accent)', background:'var(--accent-dim)', padding:'4px 8px', borderRadius:100, fontWeight:600 },
  emptyChart: { height:120, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text3)', fontSize:13 },
  avgRow: { display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:14, paddingTop:12, borderTop:'1px solid var(--border)' },
  avgLabel: { fontSize:10, color:'var(--text3)', letterSpacing:'1px', marginBottom:2 },
  avgVal: { fontSize:26, fontWeight:700, letterSpacing:'-1px' },
  avgUnit: { fontSize:12, fontWeight:400, color:'var(--text3)' },
  perfBadge: { fontSize:11, color:'var(--accent)', fontWeight:600 },
  twoCol: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 },
  miniCard: { display:'flex', flexDirection:'column', gap:4, padding:16 },
  miniLabel: { fontSize:11, color:'var(--text3)', marginTop:4 },
  miniVal: { fontSize:22, fontWeight:700 },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 },
  metricCard: { padding:16 },
  metricVal: { fontSize:26, fontWeight:700, letterSpacing:'-0.5px', color:'var(--accent)' },
  metricUnit: { fontSize:12, fontWeight:400, color:'var(--text3)' },
  metricLabel: { fontSize:12, color:'var(--text3)', marginTop:4 },
  goalsTitle: { fontSize:14, fontWeight:700, marginBottom:14 },
  goalRow: { display:'flex', justifyContent:'space-between', alignItems:'center', paddingBlock:10 },
  goalDiv: { height:1, background:'var(--border)' },
  goalLabel: { fontSize:13, color:'var(--text2)' },
  goalVal: { fontSize:14, fontWeight:600 },
};
