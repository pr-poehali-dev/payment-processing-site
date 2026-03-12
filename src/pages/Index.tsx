import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "payments" | "work" | "requisites" | "banks" | "stats" | "profile";

const navItems = [
  { id: "payments" as Section, label: "Платежи", icon: "CreditCard" },
  { id: "work" as Section, label: "Работа", icon: "Briefcase" },
  { id: "requisites" as Section, label: "Реквизиты", icon: "FileText" },
  { id: "banks" as Section, label: "Банки", icon: "Building2" },
  { id: "stats" as Section, label: "Статистика", icon: "BarChart3" },
  { id: "profile" as Section, label: "Профиль", icon: "User" },
];

const payments = [
  { id: "TXN-8821", amount: "₽ 145 000", from: "Иванов А.С.", card: "**** 4421", status: "success", time: "14:32" },
  { id: "TXN-8820", amount: "₽ 89 500", from: "ООО Ромашка", card: "**** 7710", status: "pending", time: "14:18" },
  { id: "TXN-8819", amount: "₽ 320 000", from: "Петров И.В.", card: "**** 2234", status: "success", time: "13:55" },
  { id: "TXN-8818", amount: "₽ 56 200", from: "Сидорова М.К.", card: "**** 9901", status: "failed", time: "13:40" },
  { id: "TXN-8817", amount: "₽ 210 000", from: "ИП Захаров", card: "**** 3312", status: "success", time: "12:30" },
  { id: "TXN-8816", amount: "₽ 78 900", from: "Козлов Д.Р.", card: "**** 5567", status: "pending", time: "11:15" },
];

const banks = [
  { name: "Сбербанк", code: "SBERBANK", limit: "₽ 5 000 000", used: 68, status: "active", cards: 24 },
  { name: "Тинькофф", code: "TINKOFF", limit: "₽ 3 000 000", used: 41, status: "active", cards: 18 },
  { name: "ВТБ", code: "VTB", limit: "₽ 4 500 000", used: 85, status: "warning", cards: 31 },
  { name: "Альфа-Банк", code: "ALFABANK", limit: "₽ 2 000 000", used: 22, status: "active", cards: 12 },
];

const requisites = [
  { name: "Иванов А.С.", bank: "Сбербанк", card: "4276 **** **** 4421", phone: "+7 900 123-45-67", limit: "₽ 500 000", active: true },
  { name: "Петрова О.В.", bank: "Тинькофф", card: "5536 **** **** 7710", phone: "+7 911 234-56-78", limit: "₽ 300 000", active: true },
  { name: "Козлов Д.Р.", bank: "ВТБ", card: "4893 **** **** 2234", phone: "+7 926 345-67-89", limit: "₽ 200 000", active: false },
  { name: "Сидорова М.К.", bank: "Альфа-Банк", card: "5469 **** **** 9901", phone: "+7 903 456-78-90", limit: "₽ 450 000", active: true },
];

const statusLabel: Record<string, { label: string; cls: string }> = {
  success: { label: "Выполнен", cls: "badge-success" },
  pending: { label: "В обработке", cls: "badge-warning" },
  failed: { label: "Отклонён", cls: "badge-danger" },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusLabel[status] || { label: status, cls: "badge-info" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const bg = value > 80 ? "bg-destructive" : value > 60 ? "bg-primary" : "bg-[hsl(160_80%_45%)]";
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${bg}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function PaymentsSection() {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Оборот сегодня", value: "₽ 898 600", delta: "+12.4%", icon: "TrendingUp", up: true },
          { label: "Успешных", value: "847", delta: "98.2%", icon: "CheckCircle2", up: true },
          { label: "Отклонённых", value: "15", delta: "-3 вчера", icon: "XCircle", up: false },
        ].map((c) => (
          <div key={c.label} className="stat-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</span>
              <Icon name={c.icon} size={16} className="text-muted-foreground" />
            </div>
            <div className="font-mono text-2xl font-semibold text-foreground">{c.value}</div>
            <div className={`text-xs mt-1 font-medium ${c.up ? "text-[hsl(160_80%_55%)]" : "text-destructive"}`}>{c.delta}</div>
          </div>
        ))}
      </div>

      <div className="stat-card rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-medium">Последние транзакции</span>
          <button className="text-xs text-primary hover:underline">Все транзакции →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["ID", "Отправитель", "Карта", "Сумма", "Время", "Статус"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.id}</td>
                <td className="px-5 py-3.5 text-sm text-foreground">{p.from}</td>
                <td className="px-5 py-3.5 font-mono text-sm text-muted-foreground">{p.card}</td>
                <td className="px-5 py-3.5 font-mono text-sm font-semibold text-foreground">{p.amount}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.time}</td>
                <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BanksSection() {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        {banks.map((b) => (
          <div key={b.code} className="stat-card rounded-lg p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-semibold text-foreground text-base">{b.name}</div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">{b.code}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${b.status === "active" ? "badge-success" : "badge-warning"}`}>
                {b.status === "active" ? "Активен" : "Нагрузка"}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Лимит</span>
                <span className="font-mono font-medium">{b.limit}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Использование</span>
                  <span className="font-mono">{b.used}%</span>
                </div>
                <ProgressBar value={b.used} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Карт подключено</span>
                <span className="font-mono font-medium">{b.cards}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequisitesSection() {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">{requisites.length} реквизита загружено</span>
        <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-2 rounded hover:bg-primary/90 transition-colors">
          <Icon name="Plus" size={14} />
          Добавить
        </button>
      </div>
      <div className="stat-card rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Владелец", "Банк", "Карта", "Телефон", "Лимит", "Статус"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requisites.map((r) => (
              <tr key={r.card} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5 text-sm font-medium text-foreground">{r.name}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.bank}</td>
                <td className="px-5 py-3.5 font-mono text-sm text-muted-foreground">{r.card}</td>
                <td className="px-5 py-3.5 font-mono text-sm text-muted-foreground">{r.phone}</td>
                <td className="px-5 py-3.5 font-mono text-sm font-semibold">{r.limit}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${r.active ? "badge-success" : "badge-danger"}`}>
                    {r.active ? "Активен" : "Отключён"}
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

function StatsSection() {
  const bars = [
    { day: "Пн", value: 72 }, { day: "Вт", value: 88 }, { day: "Ср", value: 64 },
    { day: "Чт", value: 95 }, { day: "Пт", value: 81 }, { day: "Сб", value: 43 }, { day: "Вс", value: 29 },
  ];
  return (
    <div className="animate-fade-in space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Оборот за неделю", value: "₽ 4 812 000", icon: "DollarSign" },
          { label: "Транзакций", value: "5 234", icon: "Activity" },
          { label: "Конверсия", value: "97.8%", icon: "TrendingUp" },
          { label: "Средний чек", value: "₽ 92 000", icon: "Calculator" },
        ].map((s) => (
          <div key={s.label} className="stat-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name={s.icon} size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <div className="font-mono text-xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="stat-card rounded-lg p-5">
        <div className="text-sm font-medium mb-5">Объём платежей по дням</div>
        <div className="flex items-end gap-3 h-32">
          {bars.map((b) => (
            <div key={b.day} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t relative hover:opacity-80 transition-opacity cursor-pointer"
                style={{ height: `${b.value}%`, background: `hsl(210 100% 56% / ${b.value / 100 * 0.8 + 0.2})` }}
              />
              <span className="text-xs text-muted-foreground font-mono">{b.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card rounded-lg p-5">
          <div className="text-sm font-medium mb-4">Распределение по банкам</div>
          <div className="space-y-3">
            {banks.map((b) => (
              <div key={b.code}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{b.name}</span>
                  <span className="font-mono font-medium">{b.used}%</span>
                </div>
                <ProgressBar value={b.used} />
              </div>
            ))}
          </div>
        </div>
        <div className="stat-card rounded-lg p-5">
          <div className="text-sm font-medium mb-4">Статусы транзакций</div>
          <div className="space-y-3">
            {[
              { label: "Успешные", count: 847, cls: "badge-success" },
              { label: "В обработке", count: 8, cls: "badge-warning" },
              { label: "Отклонённые", count: 7, cls: "badge-danger" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${s.cls}`}>{s.label}</span>
                <span className="font-mono text-sm font-semibold">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkSection() {
  const tasks = [
    { id: 1, title: "Обработка входящих платежей", status: "active", count: 124, operator: "Система" },
    { id: 2, title: "Верификация реквизитов ВТБ", status: "pending", count: 8, operator: "Иванов А." },
    { id: 3, title: "Разблокировка карт Сбербанк", status: "active", count: 3, operator: "Петров В." },
    { id: 4, title: "Пополнение лимитов Тинькофф", status: "done", count: 0, operator: "Козлов Д." },
  ];
  const statusMap: Record<string, { label: string; cls: string }> = {
    active: { label: "В работе", cls: "badge-success" },
    pending: { label: "Ожидание", cls: "badge-warning" },
    done: { label: "Завершено", cls: "badge-info" },
  };
  return (
    <div className="animate-fade-in space-y-3">
      {tasks.map((t) => {
        const s = statusMap[t.status];
        return (
          <div key={t.id} className="stat-card rounded-lg p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                t.status === "active"
                  ? "bg-[hsl(160_80%_45%)] shadow-[0_0_8px_hsl(160_80%_45%/0.6)]"
                  : t.status === "pending"
                  ? "bg-[hsl(38_92%_50%)]"
                  : "bg-muted-foreground"
              }`} />
              <div>
                <div className="text-sm font-medium text-foreground">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Оператор: {t.operator}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {t.count > 0 && (
                <span className="font-mono text-sm font-semibold text-foreground">{t.count} задач</span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${s.cls}`}>{s.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="animate-fade-in max-w-2xl space-y-4">
      <div className="stat-card rounded-lg p-6 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
          <Icon name="User" size={28} className="text-primary" />
        </div>
        <div>
          <div className="text-xl font-semibold text-foreground">Администратор</div>
          <div className="text-sm text-muted-foreground mt-0.5">admin@payflow.ru</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="badge-success text-xs px-2 py-0.5 rounded font-medium">Суперадмин</span>
            <span className="text-xs text-muted-foreground font-mono">ID: USR-0001</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Роль", value: "Суперадминистратор", icon: "Shield" },
          { label: "2FA", value: "Включена", icon: "Lock" },
          { label: "Последний вход", value: "Сегодня, 09:41", icon: "LogIn" },
          { label: "Часовой пояс", value: "UTC+3 (Москва)", icon: "Clock" },
        ].map((f) => (
          <div key={f.label} className="stat-card rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name={f.icon} size={15} className="text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{f.label}</div>
              <div className="text-sm font-medium text-foreground mt-0.5">{f.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="stat-card rounded-lg p-5">
        <div className="text-sm font-medium mb-3">Настройки безопасности</div>
        {[
          { label: "Уведомления о входе", active: true },
          { label: "SMS при крупных транзакциях", active: true },
          { label: "IP-whitelist", active: false },
        ].map((s) => (
          <div key={s.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
            <span className="text-sm text-muted-foreground">{s.label}</span>
            <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${s.active ? "bg-primary" : "bg-muted"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${s.active ? "left-4" : "left-0.5"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const sectionComponents: Record<Section, JSX.Element> = {
  payments: <PaymentsSection />,
  work: <WorkSection />,
  requisites: <RequisitesSection />,
  banks: <BanksSection />,
  stats: <StatsSection />,
  profile: <ProfileSection />,
};

const sectionTitles: Record<Section, string> = {
  payments: "Платежи",
  work: "Работа",
  requisites: "Реквизиты",
  banks: "Банки",
  stats: "Статистика",
  profile: "Профиль",
};

export default function Index() {
  const [active, setActive] = useState<Section>("payments");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-border bg-[hsl(220_20%_5%)]">
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <Icon name="Zap" size={14} className="text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-foreground">PayFlow</div>
              <div className="text-[10px] text-muted-foreground font-mono">v2.4.1 · LIVE</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all nav-item text-left ${
                active === item.id ? "nav-item-active" : "text-muted-foreground"
              }`}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(160_80%_45%)] shadow-[0_0_6px_hsl(160_80%_45%/0.8)]" />
            <span className="text-[11px] text-muted-foreground">Система работает</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <h1 className="text-base font-semibold text-foreground">{sectionTitles[active]}</h1>
            <div className="text-[11px] text-muted-foreground font-mono">
              {new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded hover:bg-muted transition-colors">
              <Icon name="Bell" size={16} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Icon name="User" size={14} className="text-primary" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6" key={active}>
          {sectionComponents[active]}
        </main>
      </div>
    </div>
  );
}
