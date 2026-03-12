import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "payments" | "transfers" | "tether" | "banks" | "devices" | "cards" | "stats" | "settings" | "profile";

// ─── DATA ────────────────────────────────────────────────────────────────────

const allTransfers = Array.from({ length: 42 }, (_, i) => ({
  id: 419716981 - i * 312,
  account: ["#831182", "#930930", "#830793", "#831333", "#831165", "#831163", "#831333", "#830487", "#831532", "#830793"][i % 10],
  sum: [109003, 50000, 20806, 10800, 25005, 9111, 10001, 30000, 33816, 21000][i % 10],
  sumUsd: [1248.321, 624.199, 249.799, 124.974, 312.639, 113.575, 124.67, 372.741, 410.134, 248.476][i % 10],
  income: [112.346, 56.177, 22.461, 11.247, 28.137, 10.221, 11.22, 33.546, 36.912, 22.362][i % 10],
  date: `${i < 20 ? "10" : "09"}.03.26 ${["16:18", "15:31", "14:43", "13:51", "13:23", "03:06", "03:05", "17:20", "15:52", "18:30"][i % 10]}`,
  bank: ["#831182", "#930938", "#830793", "#831333", "#831165", "#831163", "#831333", "#830487", "#831532", "#830793"][i % 10],
  status: i % 7 === 0 ? "canceled" : "success",
  card: `+7${["9001234567", "9112345678", "9263456789", "9034567890", "9157891234"][i % 5]}`,
}));

const banks = [
  { name: "Сбербанк", code: "SBER", limit: "₽ 5 000 000", used: 68, status: "active", cards: 24, alert: false },
  { name: "Тинькофф", code: "T-BANK", limit: "₽ 3 000 000", used: 41, status: "active", cards: 18, alert: true },
  { name: "ВТБ", code: "VTB", limit: "₽ 4 500 000", used: 85, status: "warning", cards: 31, alert: false },
  { name: "Альфа-Банк", code: "ALFA", limit: "₽ 2 000 000", used: 22, status: "active", cards: 12, alert: false },
];

const cardsList = [
  { id: "4276****4421", owner: "Иванов А.С.", bank: "Сбербанк", phone: "+7 900 123-45-67", limit: "₽ 500 000", active: true, daily: 320000 },
  { id: "5536****7710", owner: "Петрова О.В.", bank: "Тинькофф", phone: "+7 911 234-56-78", limit: "₽ 300 000", active: true, daily: 180000 },
  { id: "4893****2234", owner: "Козлов Д.Р.", bank: "ВТБ", phone: "+7 926 345-67-89", limit: "₽ 200 000", active: false, daily: 0 },
  { id: "5469****9901", owner: "Сидорова М.К.", bank: "Альфа", phone: "+7 903 456-78-90", limit: "₽ 450 000", active: true, daily: 275000 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
  const bg = value > 80 ? "bg-red-500" : value > 60 ? "bg-primary" : "bg-emerald-500";
  return (
    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${bg}`} style={{ width: `${value}%` }} />
    </div>
  );
}

// ─── TRANSFER MODAL ───────────────────────────────────────────────────────────

function TransferModal({ transfer, onClose }: { transfer: typeof allTransfers[0] | null; onClose: () => void }) {
  const [tab, setTab] = useState<"card" | "qr" | "sbp">("card");
  const [cardNum, setCardNum] = useState("");
  const [sent, setSent] = useState(false);

  if (!transfer) return null;

  const handleSend = () => setSent(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[hsl(220_18%_9%)] border border-border rounded-xl w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="text-sm font-semibold text-foreground">Перевод #{transfer.id}</div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5">Сумма: ₽ {transfer.sum.toLocaleString("ru-RU")}</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-muted transition-colors">
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {([["card", "Карта", "CreditCard"], ["qr", "QR-код", "QrCode"], ["sbp", "СБП", "Smartphone"]] as const).map(([id, label, icon]) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSent(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${tab === id ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon name={icon} size={13} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
                <Icon name="CheckCircle2" size={28} className="text-emerald-400" />
              </div>
              <div className="text-base font-semibold text-foreground">Перевод отправлен</div>
              <div className="text-xs text-muted-foreground mt-1">₽ {transfer.sum.toLocaleString("ru-RU")} · {transfer.date}</div>
              <button onClick={onClose} className="mt-4 px-5 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
                Закрыть
              </button>
            </div>
          ) : tab === "card" ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Номер карты</label>
                <input
                  value={cardNum}
                  onChange={e => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-muted border border-border rounded px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Сумма, ₽</label>
                  <input
                    defaultValue={transfer.sum}
                    className="w-full bg-muted border border-border rounded px-3 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Банк</label>
                  <select className="w-full bg-muted border border-border rounded px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors">
                    {banks.map(b => <option key={b.code}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={cardNum.replace(/\s/g, "").length < 16}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Перевести ₽ {transfer.sum.toLocaleString("ru-RU")}
              </button>
            </div>
          ) : tab === "qr" ? (
            <div className="text-center space-y-3">
              <div className="mx-auto w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-7 gap-0.5 p-2">
                  {Array.from({ length: 49 }, (_, i) => (
                    <div key={i} className={`w-5 h-5 rounded-sm ${Math.random() > 0.4 ? "bg-black" : "bg-white"}`} />
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Отсканируйте QR-код для перевода</div>
              <div className="font-mono text-lg font-bold text-primary">₽ {transfer.sum.toLocaleString("ru-RU")}</div>
              <button onClick={handleSend} className="w-full py-2.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
                Подтвердить перевод
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Номер телефона (СБП)</label>
                <input
                  defaultValue={transfer.card}
                  placeholder="+7 000 000-00-00"
                  className="w-full bg-muted border border-border rounded px-3 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Банк получателя</label>
                <select className="w-full bg-muted border border-border rounded px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors">
                  {banks.map(b => <option key={b.code}>{b.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded px-3 py-2">
                <Icon name="Smartphone" size={14} className="text-primary flex-shrink-0" />
                <span className="text-xs text-primary">Мгновенный перевод через СБП</span>
              </div>
              <button onClick={handleSend} className="w-full py-2.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
                Перевести через СБП
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADD CARD MODAL ───────────────────────────────────────────────────────────

function AddCardModal({ onClose }: { onClose: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[hsl(220_18%_9%)] border border-border rounded-xl w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-sm font-semibold">Добавить карту</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted">
            <Icon name="X" size={16} />
          </button>
        </div>
        {done ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
              <Icon name="CheckCircle2" size={24} className="text-emerald-400" />
            </div>
            <div className="text-sm font-semibold">Карта добавлена</div>
            <button onClick={onClose} className="mt-4 px-5 py-2 bg-primary text-primary-foreground rounded text-sm font-medium">Закрыть</button>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Номер карты</label>
              <input placeholder="0000 0000 0000 0000" className="w-full bg-muted border border-border rounded px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Владелец</label>
                <input placeholder="Иванов И.И." className="w-full bg-muted border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Банк</label>
                <select className="w-full bg-muted border border-border rounded px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
                  {banks.map(b => <option key={b.code}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Телефон</label>
              <input placeholder="+7 000 000-00-00" className="w-full bg-muted border border-border rounded px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Суточный лимит, ₽</label>
              <input placeholder="500000" className="w-full bg-muted border border-border rounded px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            </div>
            <button onClick={() => setDone(true)} className="w-full py-2.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
              Добавить карту
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function PaymentsSection({ accepting, onToggle }: { accepting: boolean; onToggle: () => void }) {
  const [filter, setFilter] = useState<"all" | "success" | "canceled">("all");

  const filtered = allTransfers.slice(0, 12).filter(t =>
    filter === "all" ? true : t.status === filter
  );

  return (
    <div className="animate-fade-in space-y-4">
      {/* Summary row */}
      <div className="flex items-start gap-4">
        {/* Quick summary */}
        <div className="stat-card rounded-lg p-4 flex-1">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Краткая сводка · сегодня</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            {[
              ["Платежей", "7"],
              ["Оборот", "₽2798.18"],
              ["Доход", "₽221.83"],
              ["На оплате", "56"],
              ["Заморожено", "56"],
              ["Приоритет", "80"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-mono font-medium text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rate card */}
        <div className="stat-card rounded-lg p-4 w-56">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Курс · доход</div>
          <div className="space-y-2">
            {[
              { flag: "🇷🇺", name: "Россия", rate: "80.11₽", income: "~7.28%" },
              { flag: "🇺🇿", name: "Узбекистан", rate: "13005.59 сум", income: "~2%" },
              { flag: "🇹🇷", name: "Турция", rate: "46.34₺", income: "~2%" },
            ].map(r => (
              <div key={r.name} className="flex items-center gap-2 text-xs">
                <span>{r.flag}</span>
                <span className="text-primary font-mono">{r.rate}</span>
                <span className="text-muted-foreground ml-auto">{r.income}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accept toggle */}
        <div className="stat-card rounded-lg p-4 flex flex-col items-center justify-center gap-2 w-48">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Приём платежей</div>
          <button
            onClick={onToggle}
            className={`w-full py-2 rounded text-xs font-bold tracking-wider transition-all ${
              accepting
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {accepting ? "✓ УСПЕХ" : "НА ПАУЗЕ"}
          </button>
          <div className={`flex items-center gap-1.5 text-[10px] ${accepting ? "text-emerald-400" : "text-muted-foreground"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${accepting ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-muted-foreground"}`} />
            {accepting ? "Принимаем платежи" : "Остановлено"}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1">
        {([["all", "Все"], ["success", "Успешные"], ["canceled", "Отменённые"]] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`px-4 py-1.5 text-xs rounded transition-colors font-medium ${
              filter === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="stat-card rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["id", "счёт", "сумма", "сумма, $", "доход, $", "дата", "банк", "статус"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-mono text-foreground">{t.id}</td>
                <td className="px-4 py-2.5 font-mono text-primary">{t.account}</td>
                <td className="px-4 py-2.5 font-mono font-medium">{t.sum.toLocaleString("ru-RU")}</td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground">{t.sumUsd.toFixed(3)}</td>
                <td className="px-4 py-2.5 font-mono text-emerald-400">+ {t.income.toFixed(3)}</td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-2.5 font-mono text-primary">{t.bank}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === "success" ? "badge-success" : "badge-danger"
                  }`}>
                    {t.status === "success" ? "успех" : "отмена"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransfersSection() {
  const [selected, setSelected] = useState<typeof allTransfers[0] | null>(null);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Переводы</span>
          <span className="badge-info text-xs px-2 py-0.5 rounded font-bold">4 200</span>
        </div>
        <div className="text-xs text-muted-foreground font-mono">Нажмите на перевод для отправки</div>
      </div>

      <div className="stat-card rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["id", "счёт / телефон", "сумма ₽", "сумма $", "доход $", "дата", "банк", "статус", ""].map((h, i) => (
                <th key={i} className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTransfers.map(t => (
              <tr
                key={t.id}
                className="border-b border-border/40 hover:bg-primary/5 transition-colors cursor-pointer group"
                onClick={() => setSelected(t)}
              >
                <td className="px-4 py-2.5 font-mono text-foreground">{t.id}</td>
                <td className="px-4 py-2.5 font-mono text-primary">{t.card}</td>
                <td className="px-4 py-2.5 font-mono font-semibold">{t.sum.toLocaleString("ru-RU")}</td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground">{t.sumUsd.toFixed(3)}</td>
                <td className="px-4 py-2.5 font-mono text-emerald-400">+{t.income.toFixed(3)}</td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-2.5 font-mono text-primary">{t.bank}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status === "success" ? "badge-success" : "badge-danger"}`}>
                    {t.status === "success" ? "успех" : "отмена"}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-primary text-[10px] font-medium border border-primary/40 rounded px-2 py-0.5 hover:bg-primary/10">
                    <Icon name="Send" size={10} />
                    Перевести
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransferModal transfer={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function CardsSection() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">{cardsList.length} карты подключено</span>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          <Icon name="Plus" size={14} />
          Добавить карту
        </button>
      </div>
      <div className="stat-card rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["Карта", "Владелец", "Банк", "Телефон", "Лимит", "Суточный оборот", "Статус"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cardsList.map(c => (
              <tr key={c.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-foreground">{c.id}</td>
                <td className="px-4 py-3 text-foreground font-medium">{c.owner}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.bank}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{c.phone}</td>
                <td className="px-4 py-3 font-mono font-semibold">{c.limit}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">₽ {c.daily.toLocaleString("ru-RU")}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.active ? "badge-success" : "badge-danger"}`}>
                    {c.active ? "активна" : "откл."}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd && <AddCardModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function BanksSection() {
  return (
    <div className="animate-fade-in grid grid-cols-2 gap-4">
      {banks.map(b => (
        <div key={b.code} className="stat-card rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-semibold text-foreground">{b.name}</div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{b.code}</div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${b.status === "active" ? "badge-success" : "badge-warning"}`}>
              {b.status === "active" ? "активен" : "нагрузка"}
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Лимит</span><span className="font-mono font-medium">{b.limit}</span></div>
            <div>
              <div className="flex justify-between text-muted-foreground mb-1.5"><span>Использование</span><span className="font-mono">{b.used}%</span></div>
              <ProgressBar value={b.used} />
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Карт</span><span className="font-mono font-medium">{b.cards}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsSection() {
  const bars = [72, 88, 64, 95, 81, 43, 29];
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  return (
    <div className="animate-fade-in space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Оборот за неделю", value: "₽4 812 000", icon: "DollarSign" },
          { label: "Транзакций", value: "5 234", icon: "Activity" },
          { label: "Конверсия", value: "97.8%", icon: "TrendingUp" },
          { label: "Средний чек", value: "₽92 000", icon: "Calculator" },
        ].map(s => (
          <div key={s.label} className="stat-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name={s.icon} size={13} className="text-primary" />
              <span className="text-[10px] text-muted-foreground">{s.label}</span>
            </div>
            <div className="font-mono text-lg font-semibold">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="stat-card rounded-lg p-5">
        <div className="text-xs font-medium mb-4">Объём по дням</div>
        <div className="flex items-end gap-3 h-28">
          {bars.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t hover:opacity-80 transition-opacity cursor-pointer"
                style={{ height: `${v}%`, background: `hsl(210 100% 56% / ${v / 100 * 0.7 + 0.2})` }}
              />
              <span className="text-[10px] text-muted-foreground font-mono">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="animate-fade-in max-w-xl space-y-4">
      <div className="stat-card rounded-lg p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
          <Icon name="User" size={26} className="text-primary" />
        </div>
        <div>
          <div className="text-lg font-semibold">Администратор</div>
          <div className="text-xs text-muted-foreground mt-0.5">admin@cryptopay.ru</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="badge-success text-[10px] px-2 py-0.5 rounded font-bold">Суперадмин</span>
            <span className="text-[10px] text-muted-foreground font-mono">ID: USR-0001</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Роль", value: "Суперадминистратор", icon: "Shield" },
          { label: "2FA", value: "Включена", icon: "Lock" },
          { label: "Последний вход", value: "Сегодня, 09:41", icon: "LogIn" },
          { label: "Часовой пояс", value: "UTC+3 Москва", icon: "Clock" },
        ].map(f => (
          <div key={f.label} className="stat-card rounded-lg p-4 flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name={f.icon} size={13} className="text-primary" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">{f.label}</div>
              <div className="text-xs font-medium text-foreground mt-0.5">{f.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NAV & LAYOUT ─────────────────────────────────────────────────────────────

const navItems: { id: Section; label: string; icon: string; badge?: number }[] = [
  { id: "payments", label: "Платежи", icon: "LayoutGrid" },
  { id: "transfers", label: "Переводы", icon: "ArrowLeftRight", badge: 4200 },
  { id: "tether", label: "Tether", icon: "Coins" },
  { id: "banks", label: "Банки", icon: "Building2", badge: 1 },
  { id: "devices", label: "Девайсы", icon: "Smartphone" },
  { id: "cards", label: "Карты", icon: "CreditCard" },
  { id: "stats", label: "Статистика", icon: "BarChart3" },
  { id: "settings", label: "Настройки", icon: "Settings" },
  { id: "profile", label: "Профиль", icon: "User" },
];

const sectionTitles: Record<Section, string> = {
  payments: "Платежи",
  transfers: "Переводы",
  tether: "Tether",
  banks: "Банки",
  devices: "Девайсы",
  cards: "Карты",
  stats: "Статистика",
  settings: "Настройки",
  profile: "Профиль",
};

function Placeholder({ title }: { title: string }) {
  return (
    <div className="animate-fade-in flex items-center justify-center h-64 stat-card rounded-lg">
      <div className="text-center">
        <Icon name="Construction" size={32} className="text-muted-foreground mx-auto mb-2" />
        <div className="text-sm text-muted-foreground">{title} — в разработке</div>
      </div>
    </div>
  );
}

export default function Index() {
  const [active, setActive] = useState<Section>("payments");
  const [accepting, setAccepting] = useState(false);

  const renderSection = () => {
    switch (active) {
      case "payments": return <PaymentsSection accepting={accepting} onToggle={() => setAccepting(v => !v)} />;
      case "transfers": return <TransfersSection />;
      case "cards": return <CardsSection />;
      case "banks": return <BanksSection />;
      case "stats": return <StatsSection />;
      case "profile": return <ProfileSection />;
      default: return <Placeholder title={sectionTitles[active]} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-ibm">
      {/* Sidebar */}
      <aside className="w-48 flex-shrink-0 flex flex-col border-r border-border bg-[hsl(220_20%_4%)]">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Icon name="Zap" size={13} className="text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-foreground">Crypto</span>
              <span className="text-sm font-black tracking-tight text-primary">PAY</span>
            </div>
          </div>
          <div className="font-mono text-[10px] text-muted-foreground mt-1.5">
            1$ = <span className="text-primary">80.11₽</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 px-1.5 overflow-y-auto space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all text-left nav-item ${
                active === item.id ? "nav-item-active" : "text-muted-foreground"
              }`}
            >
              <Icon name={item.icon} size={14} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${item.id === "banks" ? "badge-warning" : "badge-info"}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-1.5 pb-2 space-y-0.5 border-t border-border pt-2">
          {[
            { label: "Поддержка", icon: "HeadphonesIcon" },
            { label: "Правила", icon: "BookOpen" },
            { label: "Выход", icon: "LogOut" },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-left">
              <Icon name={item.icon} size={14} fallback="Circle" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="px-4 py-3 border-t border-border">
          <div className={`flex items-center gap-1.5 text-[10px] ${accepting ? "text-emerald-400" : "text-muted-foreground"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${accepting ? "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" : "bg-muted-foreground"}`} />
            {accepting ? "Приём активен" : "Приём на паузе"}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-12 border-b border-border flex items-center justify-between px-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-foreground">{sectionTitles[active]}</h1>
            {active === "payments" && (
              <span className="text-xs text-muted-foreground">Контролируйте выплаты на ваши реквизиты.</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {active === "payments" && (
              <button
                onClick={() => setAccepting(v => !v)}
                className={`text-xs font-medium px-3 py-1.5 rounded border transition-all ${
                  accepting
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                    : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                приём платежей: {accepting ? "успех ✓" : "на паузе"}
              </button>
            )}
            <button className="relative p-1.5 rounded hover:bg-muted transition-colors">
              <Icon name="Bell" size={15} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-1 h-1 bg-primary rounded-full" />
            </button>
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Icon name="User" size={12} className="text-primary" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5" key={active}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
