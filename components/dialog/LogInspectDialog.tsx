"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, Code, Eye, Globe, MapPin, Server, User } from "lucide-react"

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
    src_country_code?: string
    src_country_name?: string
    src_city?: string
    src_latitude?: number
    src_longitude?: number
    user: string
    host: string
    status_code: number
    raw?: string
}

interface TenantProps {
    data: LogItem | null
    index?: number
}

export function LogInspectDialog({ data, index }: TenantProps) {
    const hasGeoData =
        data?.src_latitude &&
        data?.src_longitude &&
        data.src_latitude !== 0 &&
        data.src_longitude !== 0

    const lat = data?.src_latitude ?? 0
    const lon = data?.src_longitude ?? 0

    const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.02}%2C${lat - 0.02}%2C${lon + 0.02}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lon}`

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="font-normal" variant="outline" size="sm">
                    <Eye className="h-3 w-3 text-slate-400 mr-1" /> Inspect
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden sm:max-w-4xl">
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                                <span>Log Inspection</span>
                                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                                    Index: {index ?? 0}
                                </span>
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                            Detailed event metadata and GeoIP source origin analysis.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto">
                    <div className="flex flex-col justify-between p-6 bg-slate-50/70 border-r border-slate-100 dark:bg-zinc-950/50 dark:border-zinc-800">
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-indigo-500" />
                                <span>Geographic Origin & Network Map</span>
                            </h4>

                            <div className="relative flex h-64 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                                {hasGeoData ? (
                                    <iframe
                                        title="GeoIP Location Map"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        scrolling="no"
                                        src={mapEmbedUrl}
                                        className="h-full w-full rounded-xl opacity-90 hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <div className="text-center p-4">
                                        <Globe className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                        <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                                            Private / Internal IP Address
                                        </p>
                                        <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 font-mono">
                                            No GeoIP coordinates available for {data?.src_ip}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
                            <div className="flex items-center justify-between py-1 text-slate-500 dark:text-zinc-400">
                                <span>Country:</span>
                                <span className="font-medium text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                                    {data?.src_country_code ? (
                                        <>
                                            <img
                                                src={`https://flagcdn.com/24x18/${data.src_country_code.toLowerCase()}.png`}
                                                alt={data.src_country_name}
                                                className="h-3.5 w-4 rounded-xs object-cover"
                                            />
                                            <span>{data.src_country_name} ({data.src_country_code})</span>
                                        </>
                                    ) : (
                                        "Internal Network"
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between py-1 border-t border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400">
                                <span>City Origin:</span>
                                <span className="font-medium text-slate-800 dark:text-zinc-200">
                                    {data?.src_city || "N/A"}
                                </span>
                            </div>

                            <div className="flex justify-between py-1 border-t border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400">
                                <span>Coordinates:</span>
                                <span className="font-mono text-slate-800 dark:text-zinc-200">
                                    {hasGeoData ? `${data?.src_latitude}, ${data?.src_longitude}` : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-4 bg-white dark:bg-zinc-900">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                            <Code className="h-4 w-4 text-indigo-500" />
                            <span>Event Attributes</span>
                        </h4>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-zinc-800">
                                <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-slate-400" /> Timestamp
                                </span>
                                <span className="font-mono font-medium text-slate-900 dark:text-zinc-100">
                                    {data?.["@timestamp"] || data?.timestamp}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-zinc-800">
                                <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                                    <Server className="h-3.5 w-3.5 text-slate-400" /> Tenant
                                </span>
                                <span className="font-medium text-slate-900 dark:text-zinc-100">
                                    {data?.tenant_name || data?.tenant}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-zinc-800">
                                <span className="text-slate-500 dark:text-zinc-400">Source Service</span>
                                <span className="font-mono font-medium text-slate-800 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                    {data?.source}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-zinc-800">
                                <span className="text-slate-500 dark:text-zinc-400">Event Type</span>
                                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                    {data?.event_type}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-zinc-800">
                                <span className="text-slate-500 dark:text-zinc-400">Severity Level</span>
                                <span className="font-semibold text-rose-600 dark:text-rose-400">
                                    {data?.severity}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-zinc-800">
                                <span className="text-slate-500 dark:text-zinc-400">Source IP</span>
                                <span className="font-mono font-medium text-slate-900 dark:text-zinc-100">
                                    {data?.src_ip}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-zinc-800">
                                <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-slate-400" /> User
                                </span>
                                <span className="font-medium text-slate-900 dark:text-zinc-100">
                                    {data?.user}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-zinc-800">
                                <span className="text-slate-500 dark:text-zinc-400">Host Node</span>
                                <span className="font-mono font-medium text-slate-900 dark:text-zinc-100">
                                    {data?.host}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <span className="text-slate-500 dark:text-zinc-400">Status Code</span>
                                <span className="font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                                    {data?.status_code}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2 dark:border-zinc-800 dark:bg-zinc-900">
                    <Button
                        size="sm"
                        onClick={() => {
                            if (data?.raw) {
                                navigator.clipboard.writeText(data.raw)
                                alert("Copied raw log JSON to clipboard!")
                            } else {
                                navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                                alert("Copied log object to clipboard!")
                            }
                        }}
                    >
                        Copy Raw JSON
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}