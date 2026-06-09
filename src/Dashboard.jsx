import { useState, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

/* ─── Design tokens ───────────────────────────────────────────────── */
const GOLD   = '#d4b054'
const PURPLE = '#818CF8'
const TEAL   = '#2DD4BF'
const BLUE   = '#60A5FA'
const GREEN  = '#34D399'
const PINK   = '#F472B6'
const UP_CLR = '#34D399'
const DN_CLR = '#F87171'
const CARD   = 'rgba(255,255,255,0.03)'
const BORDER = 'rgba(255,255,255,0.07)'

/* ─── Formatters ──────────────────────────────────────────────────── */
const fmt = (n) => {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return Math.round(n).toLocaleString()
}
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/* ─── Seeded LCG ──────────────────────────────────────────────────── */
const mkRng = (seed) => {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 4294967296
  }
}

/* ─── Per-platform time series ────────────────────────────────────── */
// Each platform has different baselines and available metrics:
//   Instagram: views, reach, likes, comments, shares, saves
//   YouTube:   views, likes, comments (no reach / shares / saves via public API)
const buildSeries = (seed, { baseViews, likesRate, hasReach, hasSharesSaves }) => {
  const r = mkRng(seed)
  let views    = baseViews
  let likes    = Math.round(baseViews * likesRate)
  let comments = Math.round(likes * 0.12)
  let reach    = hasReach        ? Math.round(baseViews * 0.78) : null
  let shares   = hasSharesSaves  ? Math.round(likes * 0.15)     : null
  let saves    = hasSharesSaves  ? Math.round(likes * 0.25)     : null

  return Array.from({ length: 180 }, (_, i) => {
    const d = new Date('2025-10-01')
    d.setDate(d.getDate() + i)
    views    = Math.max(500, Math.round(views * (1 + (r() - 0.45) * 0.15)))
    likes    = Math.max(20,  Math.round(views * likesRate * (0.8 + r() * 0.4)))
    comments = Math.max(5,   Math.round(likes * (0.11 + r() * 0.09)))
    if (hasReach)      reach  = Math.max(400, Math.round(views * (0.73 + r() * 0.16)))
    if (hasSharesSaves) {
      shares = Math.max(5, Math.round(likes * (0.13 + r() * 0.12)))
      saves  = Math.max(5, Math.round(likes * (0.21 + r() * 0.18)))
    }
    const denom = (hasReach ? reach : views) || 1
    const eng   = (likes + comments + (shares ?? 0) + (saves ?? 0)) / denom * 100
    return {
      date:  d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views, reach, likes, comments, shares, saves,
      engagement_rate: parseFloat(eng.toFixed(2)),
    }
  })
}

const IG_DAYS = buildSeries(11, { baseViews: 24000, likesRate: 0.048, hasReach: true,  hasSharesSaves: true  })
const YT_DAYS = buildSeries(22, { baseViews: 19000, likesRate: 0.024, hasReach: false, hasSharesSaves: false })

// Combined: sum views/likes/comments; reach/shares/saves from IG only
const ALL_DAYS = IG_DAYS.map((ig, i) => {
  const yt     = YT_DAYS[i]
  const views   = ig.views + yt.views
  const likes   = ig.likes + yt.likes
  const comments = ig.comments + yt.comments
  const { reach, shares, saves } = ig
  const denom  = (reach ?? views) || 1
  const eng    = (likes + comments + (shares ?? 0) + (saves ?? 0)) / denom * 100
  return {
    date: ig.date, label: ig.label,
    views, reach, likes, comments, shares, saves,
    engagement_rate: parseFloat(eng.toFixed(2)),
  }
})

const SERIES_MAP = { all: ALL_DAYS, instagram: IG_DAYS, youtube: YT_DAYS }

/* ─── Followers / subscribers series ─────────────────────────────── */
const buildFollowers = (seed, base) => {
  const r = mkRng(seed)
  let count = base
  return ALL_DAYS.map(d => {
    count = Math.max(0, count + Math.round((r() - 0.28) * 500))
    return { date: d.date, followers: count }
  })
}
const FOLLOWERS_IG = buildFollowers(77, 198000)
const FOLLOWERS_YT = buildFollowers(88, 124000)
// "All" view shows Instagram followers as the primary platform
const FOLLOWERS_MAP = { all: FOLLOWERS_IG, instagram: FOLLOWERS_IG, youtube: FOLLOWERS_YT }

/* ─── Mock posts ──────────────────────────────────────────────────── */
const IG_META = [
  { title: 'My exact morning trading routine',         date: '2026-03-28' },
  { title: '5 mistakes that cost new traders money',   date: '2026-03-24' },
  { title: 'Risk management in volatile markets',      date: '2026-03-20' },
  { title: 'How I use volume to find entries',         date: '2026-03-17' },
  { title: 'Gap and go strategy — full breakdown',     date: '2026-03-14' },
  { title: 'Trading psychology: staying disciplined',  date: '2026-03-10' },
  { title: 'My $4,200 week — what I traded',          date: '2026-03-07' },
  { title: 'Why most traders blow their accounts',     date: '2026-03-03' },
  { title: 'Pre-market prep checklist',                date: '2026-02-28' },
  { title: 'How to read Level 2 quotes',               date: '2026-02-24' },
  { title: 'News catalyst plays — live recap',         date: '2026-02-21' },
  { title: 'Chart patterns every trader must know',    date: '2026-02-17' },
]
const YT_META = [
  { title: "Complete Beginner's Guide to Day Trading 2026",  date: '2026-03-26' },
  { title: 'My $50K Trading Setup & Tools Revealed',        date: '2026-03-22' },
  { title: 'How I Turned $10K Into $47K in 6 Months',      date: '2026-03-19' },
  { title: 'Live Trade Recap — $3,800 Profit in 2 Hours',  date: '2026-03-15' },
  { title: 'The #1 Mistake That Keeps Traders Broke',       date: '2026-03-12' },
  { title: 'Trading With a Small Account: Real Strategy',   date: '2026-03-08' },
  { title: 'Reading Charts Like a Pro — Full Tutorial',     date: '2026-03-05' },
  { title: 'Options Trading for Beginners (Step-by-Step)', date: '2026-03-01' },
  { title: 'My Exact Trade Setups This Week',               date: '2026-02-26' },
  { title: 'The Psychology of Losing — How to Recover',    date: '2026-02-22' },
  { title: 'How I Screen Stocks in 15 Minutes Each Morning',date: '2026-02-19' },
  { title: 'Risk/Reward Ratio Explained With Real Trades',  date: '2026-02-15' },
  { title: 'Day Trading vs Swing Trading: Which is Better?',date: '2026-02-11' },
]
const IG_THUMBS = [
  ['#f9a8d4','#c084fc'], ['#fde68a','#f97316'], ['#6ee7b7','#3b82f6'],
  ['#fca5a5','#f43f5e'], ['#a5f3fc','#818CF8'], ['#d9f99d','#84cc16'],
]
const buildPosts = () => {
  const r = mkRng(99)
  const posts = []
  IG_META.forEach((p, i) => {
    const views    = Math.round(15000 + r() * 85000)
    const likes    = Math.round(views  * (0.04 + r() * 0.06))
    const comments = Math.round(likes  * (0.08 + r() * 0.12))
    const shares   = Math.round(likes  * (0.10 + r() * 0.15))
    const saves    = Math.round(likes  * (0.20 + r() * 0.25))
    const reach    = Math.round(views  * (0.75 + r() * 0.20))
    const eng      = (likes + comments + shares + saves) / reach * 100
    posts.push({
      id: `ig_${i}`, platform: 'instagram',
      title: p.title, date: p.date,
      tc: IG_THUMBS[i % IG_THUMBS.length],
      views, likes, comments, shares, saves, reach,
      engagement_rate: parseFloat(eng.toFixed(2)),
    })
  })
  YT_META.forEach((p, i) => {
    const views    = Math.round(8000  + r() * 120000)
    const likes    = Math.round(views * (0.02 + r() * 0.04))
    const comments = Math.round(likes * (0.05 + r() * 0.10))
    const eng      = views > 0 ? (likes + comments) / views * 100 : 0
    posts.push({
      id: `yt_${i}`, platform: 'youtube',
      title: p.title, date: p.date,
      tc: ['#ef4444','#991b1b'],
      views, likes, comments, shares: null, saves: null, reach: null,
      engagement_rate: parseFloat(eng.toFixed(2)),
    })
  })
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}
const MOCK_POSTS = buildPosts()

/* ─── Config ──────────────────────────────────────────────────────── */
const RANGES = [
  { label: '7d',  days: 7  },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
]

const PLATFORMS = [
  { key: 'all',       label: 'All',       activeColor: GOLD  },
  { key: 'instagram', label: 'Instagram', activeColor: PINK  },
  { key: 'youtube',   label: 'YouTube',   activeColor: '#F87171' },
]

const KPI_DEFS = [
  { id: 'viewers',   label: 'Unique Viewers',  key: 'views',           color: GOLD,   isAvg: false },
  { id: 'reach',     label: 'Reach',           key: 'reach',           color: PURPLE, isAvg: false },
  { id: 'eng',       label: 'Engagement Rate', key: 'engagement_rate', color: TEAL,   isAvg: true  },
  { id: 'followers', label: 'Followers',       key: 'followers',       color: BLUE,   isSpecial: true },
  { id: 'shares',    label: 'Shares',          key: 'shares',          color: GREEN,  isAvg: false },
  { id: 'saves',     label: 'Saves',           key: 'saves',           color: PINK,   isAvg: false },
]

const SORT_OPTIONS = [
  { label: 'Views',      key: 'views' },
  { label: 'Likes',      key: 'likes' },
  { label: 'Shares',     key: 'shares' },
  { label: 'Engagement', key: 'engagement_rate' },
]

/* ─── Shared button group component ──────────────────────────────── */
function SegmentedControl({ options, value, onChange, getActiveColor }) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${BORDER}`,
      borderRadius: 10, padding: 4,
    }}>
      {options.map((opt) => {
        const active = opt.key !== undefined ? opt.key === value : opt.label === value
        const activeColor = getActiveColor ? getActiveColor(opt) : GOLD
        return (
          <button
            key={opt.key ?? opt.label}
            onClick={() => onChange(opt.key ?? opt.label)}
            style={{
              padding: '6px 14px', borderRadius: 7, border: 'none',
              background: active ? activeColor : 'transparent',
              color:      active ? (activeColor === GOLD ? '#000' : '#fff') : 'rgba(255,255,255,0.45)',
              fontSize: 13, fontWeight: active ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Sparkline ───────────────────────────────────────────────────── */
function Sparkline({ data, color, id }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.45} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone" dataKey="value"
          stroke={color} strokeWidth={1.5}
          fill={`url(#sg-${id})`} dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ─── KPI Card ────────────────────────────────────────────────────── */
function KPICard({ def, currData, prevData, follCurr, follPrev, platform }) {
  const { id, label, key, color, isAvg, isSpecial } = def

  // "Followers" becomes "Subscribers" on YouTube
  const displayLabel = isSpecial && platform === 'youtube' ? 'Subscribers' : label

  const calc = (data, foll) => {
    if (isSpecial) return foll.at(-1)?.followers ?? 0
    if (isAvg)     return data.reduce((s, d) => s + (d[key] ?? 0), 0) / (data.length || 1)
    return data.reduce((s, d) => s + (d[key] ?? 0), 0)
  }

  const curr  = calc(currData, follCurr)
  const prev  = calc(prevData, follPrev)
  const delta = prev > 0 ? (curr - prev) / prev * 100 : null
  const isUp  = delta === null || delta >= 0

  const sparkData = isSpecial
    ? follCurr.map(d => ({ value: d.followers }))
    : currData.map(d => ({ value: d[key] ?? 0 }))

  const display = key === 'engagement_rate'
    ? `${curr.toFixed(2)}%`
    : fmt(curr)

  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
      padding: '20px 20px 14px', display: 'flex', flexDirection: 'column',
      gap: 2, minWidth: 0,
    }}>
      <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {displayLabel}
      </span>
      <span style={{ fontSize: 26, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1.25, marginTop: 4 }}>
        {display}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: isUp ? UP_CLR : DN_CLR }}>
          {isUp ? '↑' : '↓'} {delta != null ? `${Math.abs(delta).toFixed(1)}%` : '—'}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>vs prev period</span>
      </div>
      <div style={{ marginTop: 10, marginLeft: -4, marginRight: -4 }}>
        <Sparkline data={sparkData} color={color} id={id} />
      </div>
    </div>
  )
}

/* ─── Chart tooltip ───────────────────────────────────────────────── */
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#111', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#fff' }}>
      <div style={{ marginBottom: 6, color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', minWidth: 68 }}>{p.name}</span>
          <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Views & Reach area chart ────────────────────────────────────── */
function ViewsReachChart({ data }) {
  const tickInterval = data.length <= 7 ? 0 : data.length <= 14 ? 1 : data.length <= 30 ? 4 : 11
  // Only show Reach series if the current platform has reach data
  const hasReach = data.some(d => d.reach != null && d.reach > 0)

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 20px 12px' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Views & Reach</h3>
      <ResponsiveContainer width="100%" height={224}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={GOLD}   stopOpacity={0.3} />
              <stop offset="95%" stopColor={GOLD}   stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gReach" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={PURPLE} stopOpacity={0.22} />
              <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" interval={tickInterval} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} width={44} />
          <Tooltip content={<DarkTooltip />} />
          {hasReach && (
            <Area type="monotone" dataKey="reach" name="Reach" stroke={PURPLE} strokeWidth={1.5} fill="url(#gReach)" dot={false} />
          )}
          <Area type="monotone" dataKey="views" name="Views" stroke={GOLD} strokeWidth={2} fill="url(#gViews)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 18, marginTop: 10, paddingLeft: 44 }}>
        {[
          { label: 'Views', color: GOLD },
          ...(hasReach ? [{ label: 'Reach', color: PURPLE }] : []),
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            <span style={{ width: 12, height: 2, background: l.color, borderRadius: 2 }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Engagement Breakdown bar chart ──────────────────────────────── */
function EngagementChart({ data }) {
  const tickInterval = data.length <= 7 ? 0 : data.length <= 14 ? 1 : data.length <= 30 ? 4 : 11
  // Conditionally show Shares/Saves bars based on platform data availability
  const hasShares = data.some(d => d.shares != null)
  const hasSaves  = data.some(d => d.saves  != null)

  const legend = [
    { label: 'Likes',    color: GOLD   },
    { label: 'Comments', color: PURPLE },
    ...(hasShares ? [{ label: 'Shares', color: GREEN }] : []),
    ...(hasSaves  ? [{ label: 'Saves',  color: BLUE  }] : []),
  ]

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 20px 12px' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Engagement Breakdown</h3>
      <ResponsiveContainer width="100%" height={224}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="35%" barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" interval={tickInterval} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} width={44} />
          <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="likes"    name="Likes"    fill={GOLD}   radius={[3,3,0,0]} maxBarSize={10} />
          <Bar dataKey="comments" name="Comments" fill={PURPLE} radius={[3,3,0,0]} maxBarSize={10} />
          {hasShares && <Bar dataKey="shares" name="Shares" fill={GREEN} radius={[3,3,0,0]} maxBarSize={10} />}
          {hasSaves  && <Bar dataKey="saves"  name="Saves"  fill={BLUE}  radius={[3,3,0,0]} maxBarSize={10} />}
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingLeft: 44, flexWrap: 'wrap' }}>
        {legend.map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Platform badge ──────────────────────────────────────────────── */
function PlatformBadge({ platform }) {
  const ig = platform === 'instagram'
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', padding: '2px 8px',
      borderRadius: 20, textTransform: 'uppercase', whiteSpace: 'nowrap',
      background: ig ? 'rgba(244,114,182,0.12)' : 'rgba(248,113,113,0.12)',
      color:      ig ? PINK : '#F87171',
      border:     `1px solid ${ig ? 'rgba(244,114,182,0.25)' : 'rgba(248,113,113,0.25)'}`,
    }}>
      {ig ? 'Instagram' : 'YouTube'}
    </span>
  )
}

/* ─── Top Performing Posts ────────────────────────────────────────── */
function TopPostsTable({ posts }) {
  const [sortKey, setSortKey] = useState('views')

  const sorted = useMemo(
    () => [...posts].sort((a, b) => (b[sortKey] ?? -1) - (a[sortKey] ?? -1)),
    [posts, sortKey]
  )

  const isEmpty = sorted.length === 0

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Top Performing Posts</h3>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 20 }}>
            {sorted.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Sort by</span>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value)}
              style={{
                appearance: 'none', background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${BORDER}`, borderRadius: 8,
                padding: '6px 28px 6px 10px', color: '#fff',
                fontSize: 12, cursor: 'pointer', outline: 'none',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.key} value={o.key} style={{ background: '#111' }}>{o.label}</option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>▾</span>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
          No posts match the current filter
        </div>
      ) : (
        <>
          {/* Column labels */}
          <div className="posts-grid" style={{ padding: '8px 24px', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
            <div />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Post</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Views</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Likes</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Shares</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Eng. Rate</span>
          </div>
          {sorted.map((post, idx) => (
            <PostRow key={post.id} post={post} isLast={idx === sorted.length - 1} />
          ))}
        </>
      )}
    </div>
  )
}

function PostRow({ post, isLast }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="posts-grid"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '13px 24px',
        borderBottom: isLast ? 'none' : `1px solid rgba(255,255,255,0.04)`,
        background: hovered ? 'rgba(255,255,255,0.025)' : 'transparent',
        transition: 'background 0.15s',
        alignItems: 'center',
      }}
    >
      <div style={{ width: 56, height: 56, borderRadius: 8, flexShrink: 0, background: `linear-gradient(135deg, ${post.tc[0]}, ${post.tc[1]})` }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <PlatformBadge platform={post.platform} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap' }}>
            {fmtDate(post.date)}
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {post.title}
        </div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontVariantNumeric: 'tabular-nums' }}>
        {fmt(post.views)}
      </div>
      <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontVariantNumeric: 'tabular-nums' }}>
        {fmt(post.likes)}
      </div>
      <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontVariantNumeric: 'tabular-nums' }}>
        {post.shares != null ? fmt(post.shares) : <span style={{ color: 'rgba(255,255,255,0.18)' }}>—</span>}
      </div>
      <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: TEAL, fontVariantNumeric: 'tabular-nums' }}>
        {post.engagement_rate != null ? `${post.engagement_rate.toFixed(2)}%` : '—'}
      </div>
    </div>
  )
}

/* ─── Dashboard ───────────────────────────────────────────────────── */
export default function Dashboard() {
  const [platform, setPlatform] = useState('all')   // 'all' | 'instagram' | 'youtube'
  const [rangeIdx, setRangeIdx] = useState(2)        // default 30d

  const days       = RANGES[rangeIdx].days
  const series     = SERIES_MAP[platform]
  const follSeries = FOLLOWERS_MAP[platform]

  const currData  = useMemo(() => series.slice(-days),            [series, days])
  const prevData  = useMemo(() => series.slice(-days * 2, -days), [series, days])
  const follCurr  = useMemo(() => follSeries.slice(-days),            [follSeries, days])
  const follPrev  = useMemo(() => follSeries.slice(-days * 2, -days), [follSeries, days])

  const filteredPosts = useMemo(
    () => platform === 'all' ? MOCK_POSTS : MOCK_POSTS.filter(p => p.platform === platform),
    [platform]
  )

  return (
    <div style={{ minHeight: '100vh', background: '#000', padding: '36px 24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          {/* Top row: title + controls */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Content Analytics</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Instagram & YouTube performance</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Platform filter */}
              <SegmentedControl
                options={PLATFORMS}
                value={platform}
                onChange={setPlatform}
                getActiveColor={(opt) => opt.activeColor}
              />
              {/* Time range */}
              <SegmentedControl
                options={RANGES.map(r => ({ key: r.label, label: r.label }))}
                value={RANGES[rangeIdx].label}
                onChange={(label) => setRangeIdx(RANGES.findIndex(r => r.label === label))}
                getActiveColor={() => GOLD}
              />
            </div>
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {KPI_DEFS.map(def => (
            <KPICard
              key={def.id}
              def={def}
              currData={currData}
              prevData={prevData}
              follCurr={follCurr}
              follPrev={follPrev}
              platform={platform}
            />
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="charts-grid" style={{ marginBottom: 20 }}>
          <ViewsReachChart data={currData} />
          <EngagementChart data={currData} />
        </div>

        {/* ── Top posts ── */}
        <TopPostsTable posts={filteredPosts} />

      </div>
    </div>
  )
}
