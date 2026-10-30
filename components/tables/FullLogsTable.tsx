"use client"

import { useState, useEffect } from "react"
import {
    Search,
    Download,
    ChevronLeft,
    ChevronRight,
    Eye,
    ShieldAlert,
    AlertTriangle,
    Info,
    Loader2,
    RefreshCw,
    UserPlus
} from "lucide-react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { getLogsAction } from "@/app/actions/getLogs"
import { TenantMembership } from "@/app/actions/getTenants"
import { useSession } from "next-auth/react"
import { LogInspectDialog } from "../dialog/LogInspectDialog"

export interface LogItem {
    id?: string
    "@timestamp"?: string
    timestamp?: string
    tenant_name?: string
    tenant?: string
    source: string
    vendor?: string
    event_type: string
    severity: string | number
    src_ip: string
    user: string
    host: string
    status_code: number
    raw?: string
}

type TenantProps = {
    data: TenantMembership[] | null
}

export function FullLogsTable({ data }: TenantProps) {

    const { data: session } = useSession();
    const [logs, setLogs] = useState<LogItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // console.log(session)
    // console.log(data)
    console.log(logs)


    const [memberEmail, setMemberEmail] = useState("")
    const [isAddingMembership, setIsAddingMembership] = useState(false)
    const [membershipError, setMembershipError] = useState<string | null>(null)
    const [membershipSuccess, setMembershipSuccess] = useState<string | null>(null)
    const [isMembershipDialogOpen, setIsMembershipDialogOpen] = useState(false)


    const [selectedTenant, setSelectedTenant] = useState<string>(
        () => data?.[0]?.tenant_name ?? ""
    )
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSeverity, setSelectedSeverity] = useState("ALL")
    const [page, setPage] = useState<number>(1)
    const limit = 50

    const fetchLogs = async () => {
        if (!selectedTenant) return

        setIsLoading(true)
        setError(null)

        try {
            const offset = (page - 1) * limit
            const res = await getLogsAction({
                tenant: selectedTenant,
                limit,
                offset,
                search: searchTerm,
                severity: selectedSeverity,
            })

            if (res.success && res.data) {
                setLogs(res.data)
            } else {
                setError(res.error || "Failed to load logs")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (data && data.length > 0 && (!selectedTenant || !data.some(item => item.tenant_name === selectedTenant))) {
            setSelectedTenant(data[0].tenant_name)
        }
    }, [data])

    useEffect(() => {
        if (!selectedTenant) return

        const timer = setTimeout(() => {
            fetchLogs()
        }, 300)

        return () => clearTimeout(timer)
    }, [selectedTenant, page, searchTerm, selectedSeverity])

    const handleTenantChange = (value: string) => {
        setSelectedTenant(value)
        setPage(1)
    }

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setPage(1)
    }

    const handleSeverityChange = (level: string) => {
        setSelectedSeverity(level)
        setPage(1)
    }

    const handleAddMembership = async (e: React.FormEvent<HTMLFormElement>) => {

        // console.log("call handleAddMembership")

        e.preventDefault()

        setMembershipError(null)
        setMembershipSuccess(null)

        if (!selectedTenant) {
            setMembershipError("Please select a tenant")
            return
        }

        const email = memberEmail.trim().toLowerCase()

        if (!email) {
            setMembershipError("Email is required")
            return
        }

        const tenant = data?.find(
            (item) => item.tenant_name === selectedTenant
        )

        if (!tenant) {
            setMembershipError("Tenant not found")
            return
        }

        try {
            setIsAddingMembership(true)

            const res = await fetch("/api/createMembership", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    tenant_id: tenant.tenant_id,
                }),
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.message || "Failed to add membership")
            }

            setMembershipSuccess(result.message || "Membership added successfully")

            setMemberEmail("")

            setTimeout(() => {
                setIsMembershipDialogOpen(false)
                setMembershipSuccess(null)
            }, 1000)

        } catch (err) {
            setMembershipError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong"
            )
        } finally {
            setIsAddingMembership(false)
        }
    }


    const exportLogsJSON = () => {
        if (logs.length === 0) {
            alert("No logs available to export")
            return
        }

        const jsonData = JSON.stringify(logs, null, 2)

        const blob = new Blob([jsonData], {
            type: "application/json;charset=utf-8"
        })

        const url = URL.createObjectURL(blob)

        const filename = `logs_${selectedTenant}_${new Date()
            .toISOString()
            .replace(/[:.]/g, "-")}.json`

        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }


    const getSeverityBadge = (severity: unknown) => {
        let label = String(severity ?? "").toUpperCase()
        const num = Number(severity)

        if (!isNaN(num) && severity !== "" && severity !== null) {
            if (num <= 2) label = "CRITICAL"
            else if (num === 3) label = "ERROR"
            else if (num === 4) label = "WARNING"
            else label = "INFO"
        }

        switch (label) {
            case "CRITICAL":
                return (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 font-medium text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                        <ShieldAlert className="h-3 w-3" /> CRITICAL
                    </span>
                )
            case "ERROR":
                return (
                    <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 font-medium text-orange-700 dark:bg-orange-950/60 dark:text-orange-400">
                        <AlertTriangle className="h-3 w-3" /> ERROR
                    </span>
                )
            case "WARNING":
                return (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                        <AlertTriangle className="h-3 w-3" /> WARNING
                    </span>
                )
            case "INFO":
                return (
                    <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 font-medium text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
                        <Info className="h-3 w-3" /> INFO
                    </span>
                )
            default:
                return <span className="text-slate-500 font-mono">{String(severity ?? "N/A")}</span>
        }
    }

    const getStatusCodeBadge = (code: number) => {
        let colorClass = "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
        if (code >= 200 && code < 300) colorClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
        else if (code >= 400 && code < 500) colorClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
        else if (code >= 500) colorClass = "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"

        return (
            <span className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${colorClass}`}>
                {code || 0}
            </span>
        )
    }

    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">

            <div className="flex shrink-0 flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                        System Event Logs Explorer ({selectedTenant || "N/A"})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Showing captured audit trails and live security events from ClickHouse
                    </p>
                </div>

                <div className="flex items-center gap-2">

                    <Select value={selectedTenant} onValueChange={handleTenantChange}>
                        <SelectTrigger className="w-60 text-xs">
                            <SelectValue placeholder="Select Tenant" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tenants</SelectLabel>
                                {data?.map((item) => (
                                    <SelectItem key={item.tenant_id} value={item.tenant_name}>
                                        {item.tenant_name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {data?.find(item => item.tenant_name === selectedTenant)?.role?.toLowerCase() !== "viewer" && (
                        <div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="font-normal" variant="default">
                                        <UserPlus /> Add Memberships
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-sm">
                                    <form onSubmit={handleAddMembership}>
                                        <DialogHeader>
                                            <DialogTitle>Add Membership</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your profile here. Click save when you're done.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <FieldGroup>
                                            <Field>
                                                <Label htmlFor="name-1">Name</Label>
                                                <Select
                                                    value={selectedTenant}
                                                    onValueChange={handleTenantChange}
                                                    disabled
                                                >
                                                    <SelectTrigger className="w-60 text-xs">
                                                        <SelectValue placeholder="Select Tenant" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Tenants</SelectLabel>
                                                            {data?.map((item) => (
                                                                <SelectItem
                                                                    key={item.tenant_id}
                                                                    value={item.tenant_name}
                                                                >
                                                                    {item.tenant_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </Field>

                                            <Field>
                                                <Label htmlFor="username-1">Email</Label>
                                                <Input
                                                    id="membership-email"
                                                    type="email"
                                                    placeholder="user@example.com"
                                                    value={memberEmail}
                                                    onChange={(e) => setMemberEmail(e.target.value)}
                                                    required
                                                />
                                            </Field>
                                        </FieldGroup>

                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button type="submit">Save changes</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}

                    <button
                        onClick={fetchLogs}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isLoading ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </button>


                    <button
                        onClick={exportLogsJSON}
                        disabled={isLoading || logs.length === 0}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                        <Download className="h-3.5 w-5 text-slate-400" />
                        <span>Export JSON</span>
                    </button>


                </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search event_type, source, ip, tenant, user, host..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 outline-hidden placeholder:text-slate-400 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-indigo-500"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {["ALL", "CRITICAL", "ERROR", "WARNING", "INFO"].map((level) => (
                        <button
                            key={level}
                            onClick={() => handleSeverityChange(level)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${selectedSeverity === level
                                ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/90 text-slate-500 backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">Index</th>
                            <th className="px-4 py-3 font-medium">@timestamp</th>
                            <th className="px-4 py-3 font-medium">Tenant</th>
                            <th className="px-4 py-3 font-medium">Source</th>
                            <th className="px-4 py-3 font-medium">Event Type</th>
                            <th className="px-4 py-3 font-medium">Severity</th>
                            <th className="px-4 py-3 font-medium">Source IP</th>
                            <th className="px-4 py-3 font-medium">User</th>
                            <th className="px-4 py-3 font-medium">Host</th>
                            <th className="px-4 py-3 font-medium text-center">Status</th>
                            <th className="px-4 py-3 text-right font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {isLoading ? (
                            <tr>
                                <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                                        <span>Searching ClickHouse logs...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={10} className="py-12 text-center text-rose-500 dark:text-rose-400">
                                    {error}
                                </td>
                            </tr>
                        ) : logs.length > 0 ? (
                            logs.map((log, index) => (
                                <tr
                                    key={index}
                                    className="transition-colors hover:bg-slate-50/60 dark:hover:bg-zinc-800/50"
                                >
                                    <td className="px-4 py-3.5 font-mono text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                                        {index}
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                                        {log["@timestamp"] || log.timestamp}
                                    </td>
                                    <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-zinc-300">
                                        {log.tenant_name || log.tenant}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                            {log.source}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-zinc-100">
                                        {log.event_type}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        {getSeverityBadge(log.severity)}
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-slate-500 dark:text-zinc-400">
                                        {log.src_ip}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600 dark:text-zinc-300 truncate max-w-[120px]" title={log.user}>
                                        {log.user}
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-slate-500 dark:text-zinc-400">
                                        {log.host}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        {getStatusCodeBadge(log.status_code)}
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        {/* <button
                                            onClick={() => alert(`Raw log detail:\n${JSON.stringify(log, null, 2)}`)}
                                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                        >
                                            <Eye className="h-3 w-3 text-slate-400" />
                                            <span>Inspect</span>
                                        </button> */}

                                        

                                        <LogInspectDialog data={log} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                                    No log records found matching your query criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                <div>
                    Showing <span className="font-medium text-slate-700 dark:text-zinc-200">{logs.length}</span> records (Page {page})
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1 || isLoading}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span>Previous</span>
                    </button>

                    <span className="font-mono text-slate-600 dark:text-zinc-300">Page {page}</span>

                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={logs.length < limit || isLoading}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                        <span>Next</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

        </div>
    )
}