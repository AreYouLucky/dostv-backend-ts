// sample-data.ts
export type Row = {
  id: number;
  title: string;
  date: string; // ISO: YYYY-MM-DD
  status: "New" | "In Progress" | "Completed";
  assignee: string;
  tags: string[];
};

const titles = [
  "Network maintenance",
  "Database migration",
  "Ticketing bug fix",
  "UI refresh",
  "Security audit",
  "Feature request",
  "Performance tuning",
  "Deployment",
  "Documentation update",
  "Hotfix",
];

const statuses: Row["status"][] = ["New", "In Progress", "Completed"];

const assignees = [
  "Joram Leonardo",
  "Chester Francisco",
  "John Michael Cagadas",
  "Ana Santos",
  "Mark Dela Cruz",
];

const tagPool = [
  "infra",
  "backend",
  "frontend",
  "docs",
  "urgent",
  "low-priority",
  "research",
  "api",
  "db",
  "ui",
];

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

export const makeSampleData = (count = 50): Row[] =>
  Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const title = `${titles[i % titles.length]} #${id}`;
    const date = iso(2025, (i % 12) + 1, ((i * 3) % 28) + 1); // spreads across months/days
    const status = statuses[i % statuses.length];
    const assignee = assignees[i % assignees.length];
    const tags = [tagPool[i % tagPool.length], tagPool[(i + 3) % tagPool.length]];
    return { id, title, date, status, assignee, tags };
  });

export const sampleItems: Row[] = makeSampleData(53);
