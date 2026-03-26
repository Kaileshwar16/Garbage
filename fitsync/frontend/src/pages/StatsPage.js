import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/progress/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><span className="spinner" /></div>;

  const metrics = [
    { label:'Total Workouts', value: stats?.totalWorkouts ?? 0, unit:'' },
    { label:'Calories Burned', value: stats?.totalCaloriesBurned?.toLocaleString() ?? 0, unit:' kcal' },
    { label:'Current Streak', value: stats?.currentStreak ?? 0, unit:' days' },
    { label:'This Week', value: `${stats?.weeklyWorkoutsDone ?? 0}/3`, unit:' sessions' },
  ];

  const chartData = stats?.weeklyCalories || [];
  const hasChartData = chartData.some(d => d.calories > 0);

  return (
    <div className="page fade-up">
      <h2 style={styles.title}>Stats</h2>
      <p style={styles.sub}>Your progress overview</p>

      <div style={styles.grid}>
        {metrics.map((m, i) => (
          <div key={i} className="card" style={styles.metricCard}>
            <p style={styles.metricVal}>{m.value}<span style={styles.metricUnit}>{m.unit}</span></p>
            <p style={styles.metricLabel}>{m.label}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop:16 }}>
        <p style={styles.chartTitle}>Calories Burned — Last 7 Days</p>
        {hasChartData ? (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top:8, right:0, left:-20, bottom:0 }}>
              <XAxis dataKey="day" tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }}
                labelStyle={{ color:'var(--text2)' }}
                itemStyle={{ color:'var(--accent)' }}
                cursor={{ fill:'rgba(200,241,53,0.05)' }}
              />
              <Bar dataKey="calories" radius={[4,4,0,0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={_.calories > 0 ? 'var(--accent)' : 'var(--bg4)'} fillOpacity={_.calories > 0 ? 0.85 : 1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={styles.emptyChart}>
            <p>Complete workouts to see your progress 💪</p>
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="card" style={{ marginTop:12 }}>
        <p style={styles.chartTitle}>Goals</p>
        <div style={styles.goalRows}>
          <div style={styles.goalRow}>
            <span style={styles.goalLabel}>Current Weight</span>
            <span style={styles.goalVal}>{stats?.currentWeight ?? '--'} kg</span>
          </div>
          <div style={styles.goalDiv} />
          <div style={styles.goalRow}>
            <span style={styles.goalLabel}>Target Weight</span>
            <span style={styles.goalVal}>{stats?.targetWeight ?? '--'} kg</span>
          </div>
          <div style={styles.goalDiv} />
          <div style={styles.goalRow}>
            <span style={styles.goalLabel}>Daily Calorie Goal</span>
            <span style={styles.goalVal}>{stats?.dailyCalorieGoal?.toLocaleString() ?? '--'} kcal</span>
          </div>
          <div style={styles.goalDiv} />
          <div style={styles.goalRow}>
            <span style={styles.goalLabel}>Daily Protein Goal</span>
            <span style={styles.goalVal}>{stats?.dailyProteinGoal ?? '--'}g</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

const styles = {
  title: { fontSize:26, fontWeight:600, letterSpacing:'-0.3px' },
  sub: { fontSize:13, color:'var(--text3)', marginTop:4, marginBottom:20 },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 },
  metricCard: { padding:16 },
  metricVal: { fontSize:26, fontWeight:600, letterSpacing:'-0.5px', color:'var(--accent)' },
  metricUnit: { fontSize:13, fontWeight:400, color:'var(--text3)' },
  metricLabel: { fontSize:12, color:'var(--text3)', marginTop:4 },
  chartTitle: { fontSize:13, fontWeight:500, color:'var(--text2)', marginBottom:14 },
  emptyChart: { height:120, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text3)', fontSize:13 },
  goalRows: { display:'flex', flexDirection:'column' },
  goalRow: { display:'flex', justifyContent:'space-between', alignItems:'center', paddingBlock:10 },
  goalDiv: { height:1, background:'var(--border)' },
  goalLabel: { fontSize:13, color:'var(--text2)' },
  goalVal: { fontSize:14, fontWeight:500 },
};
