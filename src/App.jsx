import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://kvsakyvssftbvcgfdvmp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2c2FreXZzc2Z0YnZjZ2Zkdm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTYyMzQsImV4cCI6MjA5NjczMjIzNH0.9U7kFDvvgfhSW5zOfX-_KqJNc9sFAi94ndPvq7u5gA8"
)

const T = {
  bg: "#F8F9FA",
  card: "#FFFFFF",
  green: "#16A97A",
  greenLight: "#E8F8F2",
  greenDark: "#0D7A57",
  red: "#EF4444",
  redLight: "#FEF2F2",
  amber: "#F59E0B",
  amberLight: "#FFFBEB",
  blue: "#3B82F6",
  blueLight: "#EFF6FF",
  text: "#111827",
  textSub: "#6B7280",
  textHint: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
}

const budgets = [
  { name: "Makanan", limit: 800000, color: T.green },
  { name: "Transportasi", limit: 600000, color: T.blue },
  { name: "Langganan", limit: 300000, color: T.amber },
  { name: "Zakat / Infak", limit: 200000, color: "#8B5CF6" },
]

function fmt(amount) {
  const abs = Math.abs(amount)
  if (abs >= 1000000) return "Rp " + (abs / 1000000).toFixed(1) + " jt"
  if (abs >= 1000) return "Rp " + Math.round(abs / 1000) + "rb"
  return "Rp " + abs
}

function fmtFull(amount) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.abs(amount))
}

const Icon = {
  Home: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Chart: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Split: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>,
  User: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Refresh: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  ArrowUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  ArrowDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Brain: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2a4.5 4.5 0 014.5 4.5v.5h.5a4.5 4.5 0 010 9H9a7 7 0 110-14z"/></svg>,
  Flame: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>,
  Food: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
  Car: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2"/><circle cx="8.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  Heart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Wallet: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4a2 2 0 01-2-2V6a2 2 0 012-2h16v4"/><path d="M20 12a2 2 0 000 4h4v-4z"/></svg>,
  Bank: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V12m18 10V12M3 12l9-9 9 9M12 22V12"/><path d="M7 12v10m10-10v10"/></svg>,
  Shop: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  Notes: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Target: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  LogOut: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Diamond: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.7 10.3a2.4 2.4 0 000 3.41l7.59 7.58a2.4 2.4 0 003.41 0l7.58-7.58a2.4 2.4 0 000-3.41l-7.58-7.59a2.4 2.4 0 00-3.41 0z"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
}

function categoryInfo(cat) {
  const map = {
    Makanan: { icon: <Icon.Food />, color: T.green, bg: T.greenLight },
    Transportasi: { icon: <Icon.Car />, color: T.blue, bg: T.blueLight },
    Ojol: { icon: <Icon.Car />, color: T.blue, bg: T.blueLight },
    Belanja: { icon: <Icon.Shop />, color: "#8B5CF6", bg: "#F5F3FF" },
    Langganan: { icon: <Icon.Phone />, color: T.amber, bg: T.amberLight },
    "Zakat/Infak": { icon: <Icon.Heart />, color: "#EC4899", bg: "#FDF2F8" },
    Pemasukan: { icon: <Icon.Bank />, color: T.green, bg: T.greenLight },
    Lainnya: { icon: <Icon.Notes />, color: T.textSub, bg: T.borderLight },
  }
  return map[cat] || { icon: <Icon.Notes />, color: T.textSub, bg: T.borderLight }
}

function DonutChart({ pct, size = 120 }) {
  const r = 44, cx = 60, cy = 60
  const circ = 2 * Math.PI * r
  const dash = Math.min((pct / 100) * circ, circ)
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.borderLight} strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={pct > 90 ? T.red : T.green} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  )
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "48px 0" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", border: `3px solid ${T.border}`, borderTopColor: T.green, animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function SplashScreen({ onDone }) {
  useEffect(() => { setTimeout(onDone, 2000) }, [])
  return (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: T.green, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
          <path d="M6 8L20 32L34 8" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8L20 24L28 8" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: 4, marginBottom: 8 }}>VALO</div>
      <div style={{ fontSize: 15, color: "rgba(255,255,255,0.8)" }}>Kendali penuh atas hidupmu</div>
    </div>
  )
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 15, marginBottom: 12, boxSizing: "border-box", outline: "none", background: "#fff", color: T.text, fontFamily: "inherit" }

  async function handleSubmit() {
    if (!email || !password) { setError("Email dan password wajib diisi"); return }
    if (mode === "register" && password.length < 6) { setError("Password minimal 6 karakter"); return }
    setLoading(true); setError(""); setSuccess("")
    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError("Email atau password salah")
      else onAuth(data.user)
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
      if (error) setError(error.message)
      else if (data.user && !data.session) setSuccess("Cek email kamu untuk konfirmasi akun!")
      else if (data.user) onAuth(data.user)
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: T.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: T.green, padding: "60px 24px 40px", borderRadius: "0 0 32px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <path d="M6 8L20 32L34 8" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8L20 24L28 8" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: 2 }}>VALO</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>Kendali penuh atas hidupmu</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "24px 24px 40px" }}>
        <div style={{ display: "flex", background: T.borderLight, borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); setSuccess("") }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", background: mode === m ? "#fff" : "transparent", color: mode === m ? T.text : T.textSub, fontSize: 14, fontWeight: mode === m ? 500 : 400, boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s", fontFamily: "inherit" }}>
              {m === "login" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        {mode === "register" && (
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.textSub, marginBottom: 6 }}>Nama lengkap</div>
            <input placeholder="Nama kamu" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
        )}

        <div style={{ fontSize: 13, fontWeight: 500, color: T.textSub, marginBottom: 6 }}>Email</div>
        <input placeholder="email@kamu.com" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />

        <div style={{ fontSize: 13, fontWeight: 500, color: T.textSub, marginBottom: 6 }}>Password</div>
        <input placeholder="Minimal 6 karakter" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} style={inputStyle} />

        {error && <div style={{ background: T.redLight, border: `1px solid #FECACA`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: T.red, marginBottom: 16 }}>{error}</div>}
        {success && <div style={{ background: T.greenLight, border: `1px solid #BBF7D0`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: T.greenDark, marginBottom: 16 }}>{success}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: 16, background: T.green, color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>
          {loading ? "Memproses..." : mode === "login" ? "Masuk ke VALO" : "Buat akun VALO"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: T.textSub }}>
          {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          <span onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess("") }} style={{ color: T.green, cursor: "pointer", fontWeight: 500 }}>
            {mode === "login" ? "Daftar sekarang" : "Masuk"}
          </span>
        </div>
      </div>
    </div>
  )
}

function MainApp({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("home")
  const [showAdd, setShowAdd] = useState(false)
  const [newTx, setNewTx] = useState({ name: "", amount: "", category: "Makanan", type: "keluar" })
  const [txList, setTxList] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Kamu"
  const initials = userName.substring(0, 2).toUpperCase()

  useEffect(() => { loadTx() }, [])

  async function loadTx() {
    setLoading(true)
    const { data } = await supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
    setTxList(data || [])
    setLoading(false)
  }

  async function addTx() {
    if (!newTx.name || !newTx.amount) return
    setSaving(true)
    const amt = parseInt(newTx.amount)
    const { data, error } = await supabase.from("transactions").insert([{
      name: newTx.name, category: newTx.category,
      amount: newTx.type === "masuk" ? amt : -amt,
      icon: newTx.category, time: "Baru saja", user_id: user.id,
    }]).select()
    if (!error) { setTxList([data[0], ...txList]); showToast("Transaksi tersimpan"); setNewTx({ name: "", amount: "", category: "Makanan", type: "keluar" }); setShowAdd(false) }
    else showToast("Gagal simpan", "error")
    setSaving(false)
  }

  async function deleteTx(id) {
    await supabase.from("transactions").delete().eq("id", id)
    setTxList(txList.filter(t => t.id !== id))
    showToast("Transaksi dihapus")
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const totalMasuk = txList.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const totalKeluar = txList.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const saldo = totalMasuk - totalKeluar
  const pct = totalMasuk > 0 ? Math.min(100, Math.round((totalKeluar / totalMasuk) * 100)) : 0
  const budgetsSpent = budgets.map(b => ({ ...b, spent: txList.filter(t => t.category === b.name && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0) }))

  const tabs = [
    { id: "home", label: "Beranda", icon: <Icon.Home /> },
    { id: "laporan", label: "Laporan", icon: <Icon.Chart /> },
    { id: "split", label: "Split", icon: <Icon.Split /> },
    { id: "profil", label: "Profil", icon: <Icon.User /> },
  ]

  const inputStyle = { width: "100%", padding: "13px 15px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: 14, marginBottom: 12, boxSizing: "border-box", outline: "none", background: "#fff", color: T.text, fontFamily: "inherit" }

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: T.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", position: "relative", color: T.text, paddingBottom: 80 }}>

      {toast && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: toast.type === "error" ? T.red : T.green, color: "#fff", borderRadius: 50, padding: "10px 20px", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
          {toast.msg}
        </div>
      )}

      {activeTab === "home" && (
        <div>
          <div style={{ background: T.green, padding: "52px 20px 28px", borderRadius: "0 0 28px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 4 }}>Selamat pagi, {userName}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{fmt(saldo)}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Saldo bulan ini</div>
              </div>
              <button onClick={loadTx} style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                <Icon.Refresh />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon.ArrowUp /></div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>Pemasukan</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{fmt(totalMasuk)}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon.ArrowDown /></div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>Pengeluaran</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{fmt(totalKeluar)}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: "20px 16px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: T.card, borderRadius: 16, padding: "16px", border: `1px solid ${T.border}` }}>
                <div style={{ color: T.amber, marginBottom: 8 }}><Icon.Flame /></div>
                <div style={{ fontSize: 24, fontWeight: 700, color: T.text }}>5</div>
                <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>Hari streak</div>
                <div style={{ display: "flex", gap: 3, marginTop: 10 }}>
                  {[1,2,3,4,5,6,7].map(d => <div key={d} style={{ flex: 1, height: 4, borderRadius: 2, background: d <= 5 ? T.green : T.border }} />)}
                </div>
              </div>
              <div style={{ background: T.greenLight, borderRadius: 16, padding: "16px", border: `1px solid #BBF7D0` }}>
                <div style={{ color: T.green, marginBottom: 8 }}><Icon.Brain /></div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.greenDark, marginBottom: 4 }}>AI INSIGHT</div>
                <div style={{ fontSize: 12, color: T.greenDark, lineHeight: 1.5 }}>
                  {totalKeluar > 0 ? `Keluar ${fmt(totalKeluar)} bulan ini` : "Belum ada transaksi"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.text }}>Transaksi terakhir</div>
              <div style={{ fontSize: 13, color: T.green, fontWeight: 500 }}>{txList.length} total</div>
            </div>

            {loading ? <Spinner /> : txList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: T.textSub }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: T.borderLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: T.textHint }}>
                  <Icon.Wallet />
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: T.text, marginBottom: 4 }}>Belum ada transaksi</div>
                <div style={{ fontSize: 13 }}>Tekan + untuk mulai mencatat</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: T.card, borderRadius: 16, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                {txList.slice(0, 10).map((tx, i) => {
                  const ci = categoryInfo(tx.amount > 0 ? "Pemasukan" : tx.category)
                  return (
                    <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderBottom: i < Math.min(txList.length, 10) - 1 ? `1px solid ${T.borderLight}` : "none" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: ci.bg, display: "flex", alignItems: "center", justifyContent: "center", color: ci.color, flexShrink: 0 }}>
                        {ci.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.name}</div>
                        <div style={{ fontSize: 12, color: T.textSub, marginTop: 1 }}>{tx.category} · {tx.time}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: tx.amount > 0 ? T.green : T.red }}>
                          {tx.amount > 0 ? "+" : "−"}{fmt(tx.amount)}
                        </div>
                        <button onClick={() => deleteTx(tx.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textHint, display: "flex", padding: 0 }}>
                          <Icon.Trash />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "laporan" && (
        <div style={{ padding: "52px 16px 20px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 4 }}>Laporan</div>
          <div style={{ fontSize: 14, color: T.textSub, marginBottom: 20 }}>Semua waktu</div>

          <div style={{ background: T.card, borderRadius: 20, padding: "20px", border: `1px solid ${T.border}`, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <DonutChart pct={pct} size={110} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: pct > 90 ? T.red : T.green }}>{pct}%</div>
                  <div style={{ fontSize: 10, color: T.textSub }}>terpakai</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: T.textSub, marginBottom: 2 }}>Total pengeluaran</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.red }}>{fmt(totalKeluar)}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: T.textSub }}>Pemasukan</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: T.green }}>{fmt(totalMasuk)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: T.textSub }}>Sisa saldo</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{fmt(saldo)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 12 }}>Budget per kategori</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: T.card, borderRadius: 16, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            {budgetsSpent.map((b, i) => {
              const p = Math.min(100, Math.round((b.spent / b.limit) * 100))
              const over = b.spent > b.limit
              return (
                <div key={b.name} style={{ padding: "14px 16px", borderBottom: i < budgets.length - 1 ? `1px solid ${T.borderLight}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{b.name}</span>
                    <span style={{ fontSize: 12, color: over ? T.red : T.textSub }}>{fmt(b.spent)} / {fmt(b.limit)}</span>
                  </div>
                  <div style={{ height: 6, background: T.borderLight, borderRadius: 3 }}>
                    <div style={{ height: "100%", borderRadius: 3, width: p + "%", background: over ? T.red : b.color, transition: "width 0.4s" }} />
                  </div>
                  {over && <div style={{ fontSize: 11, color: T.red, marginTop: 5 }}>Over budget {fmt(b.spent - b.limit)}</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === "split" && (
        <div style={{ padding: "52px 20px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: T.greenLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: T.green }}>
            <Icon.Split />
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 8 }}>Split bill</div>
          <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7 }}>Fitur hutang piutang<br />sedang dibangun. Coming soon!</div>
        </div>
      )}

      {activeTab === "profil" && (
        <div style={{ padding: "52px 16px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 auto 12px" }}>{initials}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: T.text }}>{userName}</div>
            <div style={{ fontSize: 13, color: T.textSub, marginTop: 3 }}>{user.email}</div>
          </div>

          <div style={{ background: T.green, borderRadius: 16, padding: "16px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 3 }}>VALO Pro</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Upgrade sekarang</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Rp 19.000 / bulan</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: T.green, cursor: "pointer" }}>Mulai</div>
          </div>

          <div style={{ background: T.card, borderRadius: 16, border: `1px solid ${T.border}`, marginBottom: 12, overflow: "hidden" }}>
            {[
              { icon: <Icon.Bell />, label: "Notifikasi" },
              { icon: <Icon.Target />, label: "Target keuangan" },
              { icon: <Icon.Lock />, label: "Keamanan & privasi" },
            ].map((item, i) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", borderBottom: i < 2 ? `1px solid ${T.borderLight}` : "none", cursor: "pointer" }}>
                <div style={{ color: T.textSub }}>{item.icon}</div>
                <span style={{ fontSize: 14, flex: 1, color: T.text }}>{item.label}</span>
                <div style={{ color: T.textHint }}><Icon.ChevronRight /></div>
              </div>
            ))}
          </div>

          <button onClick={async () => { await supabase.auth.signOut(); onLogout() }} style={{ width: "100%", padding: 14, background: T.redLight, border: `1px solid #FECACA`, borderRadius: 14, color: T.red, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
            <Icon.LogOut /> Keluar dari akun
          </button>
        </div>
      )}

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "20px 20px 40px", width: "100%", maxWidth: 390, margin: "0 auto", boxSizing: "border-box" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: T.border, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.text }}>Tambah transaksi</div>
              <button onClick={() => setShowAdd(false)} style={{ background: T.borderLight, border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textSub }}>
                <Icon.Close />
              </button>
            </div>

            <div style={{ display: "flex", background: T.borderLight, borderRadius: 12, padding: 4, marginBottom: 18 }}>
              {["keluar","masuk"].map(t => (
                <button key={t} onClick={() => setNewTx({ ...newTx, type: t })} style={{ flex: 1, padding: "10px 0", borderRadius: 9, border: "none", cursor: "pointer", background: newTx.type === t ? (t === "keluar" ? T.red : T.green) : "transparent", color: newTx.type === t ? "#fff" : T.textSub, fontWeight: 500, fontSize: 14, transition: "all 0.15s", fontFamily: "inherit" }}>
                  {t === "keluar" ? "Pengeluaran" : "Pemasukan"}
                </button>
              ))}
            </div>

            <input placeholder="Nama transaksi" value={newTx.name} onChange={e => setNewTx({ ...newTx, name: e.target.value })} style={inputStyle} />
            <input placeholder="Jumlah (contoh: 25000)" type="number" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} style={inputStyle} />
            <select value={newTx.category} onChange={e => setNewTx({ ...newTx, category: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
              {["Makanan","Transportasi","Ojol","Belanja","Langganan","Zakat/Infak","Lainnya"].map(c => <option key={c}>{c}</option>)}
            </select>

            <button onClick={addTx} disabled={saving || !newTx.name || !newTx.amount} style={{ width: "100%", padding: 15, background: newTx.name && newTx.amount ? T.green : T.border, color: newTx.name && newTx.amount ? "#fff" : T.textSub, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
              {saving ? "Menyimpan..." : "Simpan transaksi"}
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setShowAdd(true)} style={{ position: "fixed", bottom: 86, right: "calc(50% - 195px + 16px)", width: 52, height: 52, borderRadius: "50%", background: T.green, border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, boxShadow: "0 4px 16px rgba(22,169,122,0.4)" }}>
        <Icon.Plus />
      </button>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 390, background: "#fff", borderTop: `1px solid ${T.border}`, display: "flex", padding: "10px 0 20px", zIndex: 50 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: 0 }}>
            <div style={{ color: activeTab === tab.id ? T.green : T.textHint, display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.2s" }}>
              {tab.icon}
            </div>
            <div style={{ fontSize: 11, fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? T.green : T.textHint }}>
              {tab.label}
            </div>
            {activeTab === tab.id && <div style={{ width: 18, height: 3, borderRadius: 2, background: T.green }} />}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState("splash")
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); setScreen("app") }
      else setScreen("splash")
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) { setUser(session.user); setScreen("app") }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (screen === "splash") return <SplashScreen onDone={() => setScreen("auth")} />
  if (screen === "auth") return <AuthScreen onAuth={(u) => { setUser(u); setScreen("app") }} />
  return <MainApp user={user} onLogout={() => { setUser(null); setScreen("auth") }} />
}