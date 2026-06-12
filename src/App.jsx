import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://kvsakyvssftbvcgfdvmp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2c2FreXZzc2Z0YnZjZ2Zkdm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTYyMzQsImV4cCI6MjA5NjczMjIzNH0.9U7kFDvvgfhSW5zOfX-_KqJNc9sFAi94ndPvq7u5gA8"
)

const budgets = [
  { name: "Makanan", icon: "🍽️", limit: 800000, color: "#1D9E75" },
  { name: "Transportasi", icon: "🛵", limit: 600000, color: "#5DCAA5" },
  { name: "Langganan", icon: "📱", limit: 300000, color: "#FAC775" },
  { name: "Zakat / Infak", icon: "🤲", limit: 200000, color: "#9B8FE8" },
]

const C = {
  bg: "#080F1C", card: "#111B2E", card2: "#162035",
  green: "#1D9E75", mint: "#5DCAA5", amber: "#FAC775",
  red: "#F06B6B", text: "#FFFFFF", sub: "#7A8FA6",
  border: "rgba(255,255,255,0.07)",
}

function fmt(amount) {
  const abs = Math.abs(amount)
  if (abs >= 1000000) return "Rp " + (abs / 1000000).toFixed(1) + " jt"
  if (abs >= 1000) return "Rp " + Math.round(abs / 1000) + "rb"
  return "Rp " + abs
}

function DonutChart({ pct, size = 160 }) {
  const r = 54, cx = 80, cy = 80
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox="0 0 160 160">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.green} strokeWidth="16"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 80 80)" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <circle cx={cx} cy={cy} r={r - 20} fill="none" stroke={C.mint} strokeWidth="8"
        strokeDasharray={`${(pct * 0.6 / 100) * (2 * Math.PI * (r - 20))} 999`}
        strokeLinecap="round" transform="rotate(-90 80 80)" style={{ opacity: 0.5 }} />
    </svg>
  )
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid rgba(29,158,117,0.2)`, borderTopColor: C.green, animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ─── AUTH SCREENS ───────────────────────────────────────────────

function SplashScreen({ onDone }) {
  useEffect(() => { setTimeout(onDone, 2000) }, [])
  return (
    <div style={{
      maxWidth: 390, margin: "0 auto", minHeight: "100vh",
      background: C.bg, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24, background: C.green,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, boxShadow: "0 0 40px rgba(29,158,117,0.4)"
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M6 8L20 32L34 8" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 8L20 24L29 8" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color: C.text, letterSpacing: 4, marginBottom: 8 }}>VALO</div>
      <div style={{ fontSize: 14, color: C.sub }}>Kendali penuh atas hidupmu</div>
      <div style={{ marginTop: 48, display: "flex", gap: 6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: i === 0 ? 24 : 6, height: 6, borderRadius: 3, background: i === 0 ? C.green : "rgba(255,255,255,0.15)" }} />
        ))}
      </div>
    </div>
  )
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login") // login | register
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit() {
    if (!email || !password) { setError("Email dan password wajib diisi"); return }
    if (mode === "register" && password.length < 6) { setError("Password minimal 6 karakter"); return }
    setLoading(true); setError(""); setSuccess("")

    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message === "Invalid login credentials" ? "Email atau password salah" : error.message)
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
    <div style={{
      maxWidth: 390, margin: "0 auto", minHeight: "100vh",
      background: C.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex", flexDirection: "column"
    }}>
      {/* Top decoration */}
      <div style={{ height: 200, background: "linear-gradient(160deg, #0F2D1E 0%, #080F1C 100%)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(29,158,117,0.1)" }} />
        <div style={{ position: "absolute", top: 20, right: 20, width: 80, height: 80, borderRadius: "50%", background: "rgba(29,158,117,0.08)" }} />
        <div style={{ position: "absolute", bottom: 28, left: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
              <path d="M6 8L20 32L34 8" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 8L20 24L29 8" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: 2 }}>VALO</div>
            <div style={{ fontSize: 12, color: C.mint }}>Kendali penuh atas hidupmu</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: "28px 24px 40px" }}>
        {/* Tab toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 4, marginBottom: 28 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); setSuccess("") }} style={{
              flex: 1, padding: "11px 0", borderRadius: 11, border: "none", cursor: "pointer",
              background: mode === m ? C.green : "transparent",
              color: mode === m ? "#fff" : C.sub,
              fontSize: 14, fontWeight: mode === m ? 600 : 400, transition: "all 0.2s"
            }}>{m === "login" ? "Masuk" : "Daftar"}</button>
          ))}
        </div>

        {mode === "register" && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>Nama lengkap</div>
            <input placeholder="Nama kamu" value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 13, border: `1px solid rgba(255,255,255,0.1)`, background: C.card, color: "#fff", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>Email</div>
          <input placeholder="email@kamu.com" type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 13, border: `1px solid rgba(255,255,255,0.1)`, background: C.card, color: "#fff", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>Password</div>
          <input placeholder="Minimal 6 karakter" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 13, border: `1px solid rgba(255,255,255,0.1)`, background: C.card, color: "#fff", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
        </div>

        {error && (
          <div style={{ background: "rgba(240,107,107,0.12)", border: "1px solid rgba(240,107,107,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.red, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ background: "rgba(29,158,117,0.12)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.mint, marginBottom: 16 }}>
            ✅ {success}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: 16, background: C.green, color: "#fff",
          border: "none", borderRadius: 14, fontSize: 15, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
          boxShadow: "0 4px 20px rgba(29,158,117,0.3)", transition: "opacity 0.2s"
        }}>
          {loading ? "Memproses..." : mode === "login" ? "Masuk ke VALO" : "Buat akun VALO"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: C.sub }}>
          {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          <span onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess("") }}
            style={{ color: C.mint, cursor: "pointer", fontWeight: 500 }}>
            {mode === "login" ? "Daftar sekarang" : "Masuk"}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN APP ────────────────────────────────────────────────────

function MainApp({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("home")
  const [showAdd, setShowAdd] = useState(false)
  const [newTx, setNewTx] = useState({ name: "", amount: "", category: "Makanan", type: "keluar" })
  const [txList, setTxList] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Kamu"

  useEffect(() => { loadTransactions() }, [])

  async function loadTransactions() {
    setLoading(true)
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    if (error) showToast("Gagal load: " + error.message, "error")
    else setTxList(data || [])
    setLoading(false)
  }

  async function addTx() {
    if (!newTx.name || !newTx.amount) return
    setSaving(true)
    const amt = parseInt(newTx.amount)
    const tx = {
      name: newTx.name, category: newTx.category,
      amount: newTx.type === "masuk" ? amt : -amt,
      icon: newTx.type === "masuk" ? "💰" : categoryIcon(newTx.category),
      time: "Baru saja", user_id: user.id,
    }
    const { data, error } = await supabase.from("transactions").insert([tx]).select()
    if (error) showToast("Gagal simpan: " + error.message, "error")
    else { setTxList([data[0], ...txList]); showToast("Tersimpan! ✓"); setNewTx({ name: "", amount: "", category: "Makanan", type: "keluar" }); setShowAdd(false) }
    setSaving(false)
  }

  async function deleteTx(id) {
    const { error } = await supabase.from("transactions").delete().eq("id", id)
    if (!error) { setTxList(txList.filter(t => t.id !== id)); showToast("Dihapus") }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    onLogout()
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function categoryIcon(cat) {
    const map = { Makanan: "🍽️", Transportasi: "🛵", Ojol: "🛵", Belanja: "🛍️", Langganan: "📱", "Zakat/Infak": "🤲", Lainnya: "📝" }
    return map[cat] || "📝"
  }

  const totalMasuk = txList.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const totalKeluar = txList.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const saldo = totalMasuk - totalKeluar
  const pct = totalMasuk > 0 ? Math.min(100, Math.round((totalKeluar / totalMasuk) * 100)) : 0
  const budgetsWithSpent = budgets.map(b => ({ ...b, spent: txList.filter(t => t.category === b.name && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0) }))

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", position: "relative", color: C.text }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "absolute", top: 16, left: 16, right: 16, zIndex: 100, background: toast.type === "success" ? "rgba(29,158,117,0.95)" : "rgba(240,107,107,0.95)", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 500, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          {toast.msg}
        </div>
      )}

      {/* BERANDA */}
      {activeTab === "home" && (
        <div style={{ paddingBottom: 90 }}>
          <div style={{ padding: "52px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: C.sub, marginBottom: 2 }}>Selamat pagi, {userName} 👋</div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>VALO</div>
            </div>
            <button onClick={loadTransactions} style={{ width: 40, height: 40, borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }} title="Refresh">🔄</button>
          </div>

          {/* Donut */}
          <div style={{ background: C.card, margin: "20px 16px", borderRadius: 24, padding: "24px 20px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <DonutChart pct={pct} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{pct}%</div>
                  <div style={{ fontSize: 10, color: C.sub }}>terpakai</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.sub, marginBottom: 4 }}>Total saldo</div>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginBottom: 16 }}>{fmt(saldo)}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
                    <div style={{ fontSize: 12, color: C.sub, flex: 1 }}>Pemasukan</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.mint }}>{fmt(totalMasuk)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.red }} />
                    <div style={{ fontSize: 12, color: C.sub, flex: 1 }}>Pengeluaran</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.red }}>{fmt(totalKeluar)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "0 16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ background: C.card, borderRadius: 18, padding: 14, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>🔥</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>5</div>
                <div style={{ fontSize: 11, color: C.sub }}>hari streak</div>
                <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
                  {[1,2,3,4,5,6,7].map(d => <div key={d} style={{ flex: 1, height: 4, borderRadius: 2, background: d <= 5 ? C.green : "rgba(255,255,255,0.1)" }} />)}
                </div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #0F3D2E, #1A6B4A)", borderRadius: 18, padding: 14, border: "1px solid rgba(29,158,117,0.3)" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>🧠</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.mint, marginBottom: 4 }}>AI INSIGHT</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                  {totalKeluar > 0 ? `Total keluar ${fmt(totalKeluar)} bulan ini` : "Belum ada transaksi"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Transaksi terakhir</div>
              <div style={{ fontSize: 12, color: C.sub }}>{txList.length} transaksi</div>
            </div>

            {loading ? <Spinner /> : txList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: C.sub }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 14 }}>Belum ada transaksi</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Tekan + untuk mulai mencatat</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {txList.slice(0, 10).map(tx => (
                  <div key={tx.id} style={{ background: C.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: tx.amount > 0 ? "rgba(29,158,117,0.15)" : "rgba(240,107,107,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{tx.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.name}</div>
                      <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{tx.category} · {tx.time}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: tx.amount > 0 ? C.mint : C.red }}>{tx.amount > 0 ? "+" : "−"}{fmt(tx.amount)}</div>
                      <button onClick={() => deleteTx(tx.id)} style={{ background: "rgba(240,107,107,0.1)", border: "none", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontSize: 11, color: C.red }}>hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LAPORAN */}
      {activeTab === "laporan" && (
        <div style={{ padding: "52px 16px 90px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Laporan</div>
          <div style={{ fontSize: 13, color: C.sub, marginBottom: 20 }}>Semua waktu</div>
          <div style={{ background: C.card, borderRadius: 24, padding: "28px 20px", border: `1px solid ${C.border}`, marginBottom: 16, textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <DonutChart pct={pct} size={180} />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{fmt(totalKeluar)}</div>
                <div style={{ fontSize: 12, color: C.sub }}>pengeluaran</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 11, color: C.sub, marginBottom: 4 }}>Pemasukan</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.mint }}>{fmt(totalMasuk)}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 11, color: C.sub, marginBottom: 4 }}>Sisa</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.green }}>{fmt(saldo)}</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Budget per kategori</div>
          {loading ? <Spinner /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {budgetsWithSpent.map(b => {
                const p = Math.min(100, Math.round((b.spent / b.limit) * 100))
                const over = b.spent > b.limit
                return (
                  <div key={b.name} style={{ background: C.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 20 }}>{b.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{b.name}</span>
                      <span style={{ fontSize: 12, color: over ? C.red : C.sub }}>{fmt(b.spent)} / {fmt(b.limit)}</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                      <div style={{ height: "100%", borderRadius: 3, width: p + "%", background: over ? C.red : b.color, transition: "width 0.4s" }} />
                    </div>
                    {over && <div style={{ fontSize: 11, color: C.red, marginTop: 6 }}>Over {fmt(b.spent - b.limit)}</div>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* SPLIT */}
      {activeTab === "split" && (
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>👥</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Split bill</div>
          <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.7 }}>Fitur hutang piutang<br />sedang dibangun. Coming soon!</div>
        </div>
      )}

      {/* PROFIL */}
      {activeTab === "profil" && (
        <div style={{ padding: "52px 16px 90px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg, #1D9E75, #0A4D38)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 14px" }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{userName}</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>{user.email}</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{txList.length} transaksi · Database aktif ✓</div>
          </div>

          <div style={{ background: "linear-gradient(135deg, #0F3D2E, #1D9E75)", borderRadius: 20, padding: "18px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: C.mint, marginBottom: 4 }}>✨ VALO Pro</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Upgrade sekarang</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Rp 19rb/bulan</div>
            </div>
            <div style={{ background: C.green, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Mulai</div>
          </div>

          <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, marginBottom: 16 }}>
            {[
              { icon: "🔔", label: "Notifikasi" },
              { icon: "🎯", label: "Target keuangan" },
              { icon: "🔒", label: "Keamanan & privasi" },
            ].map((item, i) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderBottom: i < 2 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontSize: 14, flex: 1 }}>{item.label}</span>
                <span style={{ color: C.sub, fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>

          <button onClick={handleLogout} style={{ width: "100%", padding: 14, background: "rgba(240,107,107,0.1)", border: "1px solid rgba(240,107,107,0.2)", borderRadius: 14, color: C.red, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            Keluar dari akun
          </button>
        </div>
      )}

      {/* MODAL TAMBAH */}
      {showAdd && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 50 }}>
          <div style={{ background: "#131E30", borderRadius: "24px 24px 0 0", padding: "20px 20px 44px", width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}` }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 20px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 17, fontWeight: 600 }}>Tambah transaksi</div>
              <button onClick={() => setShowAdd(false)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, color: C.sub }}>✕</button>
            </div>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 4, marginBottom: 18 }}>
              {["keluar", "masuk"].map(t => (
                <button key={t} onClick={() => setNewTx({ ...newTx, type: t })} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer", background: newTx.type === t ? (t === "keluar" ? C.red : C.green) : "transparent", color: newTx.type === t ? "#fff" : C.sub, fontWeight: 500, fontSize: 14, transition: "all 0.15s" }}>
                  {t === "keluar" ? "Pengeluaran" : "Pemasukan"}
                </button>
              ))}
            </div>
            {[{ placeholder: "Nama transaksi (cth: Gojek, Warung)", key: "name", type: "text" }, { placeholder: "Jumlah (cth: 25000)", key: "amount", type: "number" }].map(f => (
              <input key={f.key} placeholder={f.placeholder} type={f.type} value={newTx[f.key]}
                onChange={e => setNewTx({ ...newTx, [f.key]: e.target.value })}
                style={{ width: "100%", padding: "13px 15px", borderRadius: 12, border: `1px solid rgba(255,255,255,0.1)`, background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, marginBottom: 12, boxSizing: "border-box", outline: "none" }} />
            ))}
            <select value={newTx.category} onChange={e => setNewTx({ ...newTx, category: e.target.value })}
              style={{ width: "100%", padding: "13px 15px", borderRadius: 12, border: `1px solid rgba(255,255,255,0.1)`, background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, marginBottom: 20, boxSizing: "border-box", outline: "none", appearance: "none" }}>
              {["Makanan","Transportasi","Ojol","Belanja","Langganan","Zakat/Infak","Lainnya"].map(c => <option key={c} style={{ background: "#131E30" }}>{c}</option>)}
            </select>
            <button onClick={addTx} disabled={saving} style={{ width: "100%", padding: 15, background: newTx.name && newTx.amount ? C.green : "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}>
              {saving ? "Menyimpan..." : "Simpan transaksi"}
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      {!showAdd && (
        <button onClick={() => setShowAdd(true)} style={{ position: "absolute", bottom: 84, right: 20, width: 54, height: 54, borderRadius: "50%", background: C.green, border: "3px solid #080F1C", color: "#fff", fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, boxShadow: "0 6px 20px rgba(29,158,117,0.4)" }}>+</button>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#0D1825", borderTop: `1px solid ${C.border}`, display: "flex", padding: "12px 0 20px" }}>
        {[{ id: "home", label: "Beranda", emoji: "🏠" }, { id: "laporan", label: "Laporan", emoji: "📊" }, { id: "split", label: "Split", emoji: "👥" }, { id: "profil", label: "Profil", emoji: "👤" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
            <div style={{ width: 40, height: 36, borderRadius: 10, background: activeTab === tab.id ? "rgba(29,158,117,0.18)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "background 0.2s" }}>{tab.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? C.green : C.sub }}>{tab.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── ROOT ────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("splash") // splash | auth | app
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Cek kalau user sudah login sebelumnya
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); setScreen("app") }
      else setScreen("splash")
    })
    // Listen perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) { setUser(session.user); setScreen("app") }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (screen === "splash") return <SplashScreen onDone={() => setScreen("auth")} />
  if (screen === "auth") return <AuthScreen onAuth={(u) => { setUser(u); setScreen("app") }} />
  return <MainApp user={user} onLogout={() => { setUser(null); setScreen("auth") }} />
}