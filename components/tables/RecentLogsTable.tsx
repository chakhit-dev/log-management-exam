"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type LogLevel = "INFO" | "WARN" | "ERROR"

interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  service: string
  message: string
}

const logData: LogEntry[] = [
  {
    id: "1",
    timestamp: "14:23:01",
    level: "ERROR",
    service: "auth-service",
    message: "Failed login attempt from 192.168.1.45",
  },
  {
    id: "2",
    timestamp: "14:22:58",
    level: "WARN",
    service: "api-gateway",
    message: "Rate limit approaching for client_882",
  },
  {
    id: "3",
    timestamp: "14:22:45",
    level: "INFO",
    service: "payment-svc",
    message: "Transaction #TX99201 processed successfully",
  },
  {
    id: "4",
    timestamp: "14:22:12",
    level: "ERROR",
    service: "db-cluster",
    message: "Connection timeout on replica node-02",
  },
  {
    id: "5",
    timestamp: "14:21:50",
    level: "INFO",
    service: "worker-queue",
    message: "Batch job #441 completed in 1.2s",
  },
]

const levelBadgeStyles: Record<LogLevel, string> = {
  INFO: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  WARN: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  ERROR: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800",
}

export function RecentLogsTable() {
  const recentLogs = logData.slice(0, 10)

  return (
    <Card className="h-full flex flex-col overflow-hidden py-4 gap-2">
      <CardHeader className="shrink-0 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent System Logs</CardTitle>
            <CardDescription className="text-xs">
              Showing latest 5 events across services
            </CardDescription>
          </div>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-auto px-4 pb-0">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="py-2 pr-2 font-medium w-16">Time</th>
              <th className="py-2 px-2 font-medium w-16">Level</th>
              <th className="py-2 px-2 font-medium w-24">Service</th>
              <th className="py-2 pl-2 font-medium">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {recentLogs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <td className="py-2 pr-2 font-mono text-slate-400 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-2 px-2 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                      levelBadgeStyles[log.level]
                    }`}
                  >
                    {log.level}
                  </span>
                </td>
                <td className="py-2 px-2 font-medium text-slate-700 dark:text-zinc-300 whitespace-nowrap">
                  {log.service}
                </td>
                <td className="py-2 pl-2 text-slate-600 dark:text-zinc-400 truncate max-w-[180px]">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}