// "use server"

// import { clickhouse } from "@/lib/clickhouse"
// import { LogItem } from "@/components/tables/FullLogsTable"

// export interface GetLogsParams {
//     tenant: string
//     limit?: number
//     offset?: number
//     search?: string
//     severity?: string
// }

// export async function getLogsAction({
//     tenant,
//     limit = 50,
//     offset = 0,
//     search = "",
//     severity = "ALL",
// }: GetLogsParams) {
//     try {
//         const result = await clickhouse.query({
//             query: `
//                 SELECT 
//                     \`@timestamp\`,
//                     coalesce(nullIf(tenant, ''), extract(raw, 'tenant=([a-zA-Z0-9]+)')) AS tenant_name,
//                     source,
//                     vendor,
//                     event_type,
//                     severity,
//                     toString(src_ip) AS src_ip,
//                     user,
//                     host,
//                     status_code,
//                     raw
//                 FROM central_logs
//                 WHERE (tenant = {tenant: String} OR raw LIKE concat('%tenant=', {tenant: String}, '%'))
//                   AND (
//                     {severity: String} = 'ALL' OR
//                     ({severity: String} = 'CRITICAL' AND severity IN (0, 1, 2)) OR
//                     ({severity: String} = 'ERROR' AND severity = 3) OR
//                     ({severity: String} = 'WARNING' AND severity = 4) OR
//                     ({severity: String} = 'INFO' AND severity IN (5, 6, 7)) OR
//                     toString(severity) = {severity: String}
//                   )
//                   AND (
//                     {search: String} = '' OR 
//                     event_type ILIKE concat('%', {search: String}, '%') OR
//                     source ILIKE concat('%', {search: String}, '%') OR
//                     toString(src_ip) ILIKE concat('%', {search: String}, '%') OR
//                     user ILIKE concat('%', {search: String}, '%') OR
//                     host ILIKE concat('%', {search: String}, '%')
//                   )
//                 ORDER BY \`@timestamp\` DESC
//                 LIMIT {limit: UInt32} OFFSET {offset: UInt32};
//             `,
//             query_params: {
//                 tenant,
//                 limit,
//                 offset,
//                 search: search.trim(),
//                 severity,
//             },
//             format: 'JSONEachRow',
//         })

//         const data = (await result.json()) as LogItem[]
//         return { success: true, data }
//     } catch (error) {
//         console.error("ClickHouse Query Error:", error)
//         return { 
//             success: false, 
//             error: error instanceof Error ? error.message : "Failed to fetch logs" 
//         }
//     }
// }

"use server"

import { clickhouse } from "@/lib/clickhouse"
import { LogItem } from "@/components/tables/FullLogsTable"

export interface GetLogsParams {
    tenant: string
    limit?: number
    offset?: number
    search?: string
    severity?: string
}

export async function getLogsAction({
    tenant,
    limit = 50,
    offset = 0,
    search = "",
    severity = "ALL",
}: GetLogsParams) {
    try {
        const result = await clickhouse.query({
            query: `
                SELECT 
                    \`@timestamp\`,
                    coalesce(nullIf(tenant, ''), extract(raw, 'tenant=([a-zA-Z0-9]+)')) AS tenant_name,
                    source,
                    vendor,
                    event_type,
                    severity,
                    toString(src_ip) AS src_ip,
                    src_country_code,
                    src_country_name,
                    src_city,
                    src_latitude,
                    src_longitude,
                    user,
                    host,
                    status_code,
                    raw
                FROM central_logs
                WHERE (tenant = {tenant: String} OR raw LIKE concat('%tenant=', {tenant: String}, '%'))
                  AND (
                    {severity: String} = 'ALL' OR
                    ({severity: String} = 'CRITICAL' AND severity IN (0, 1, 2)) OR
                    ({severity: String} = 'ERROR' AND severity = 3) OR
                    ({severity: String} = 'WARNING' AND severity = 4) OR
                    ({severity: String} = 'INFO' AND severity IN (5, 6, 7)) OR
                    toString(severity) = {severity: String}
                  )
                  AND (
                    {search: String} = '' OR 
                    event_type ILIKE concat('%', {search: String}, '%') OR
                    source ILIKE concat('%', {search: String}, '%') OR
                    toString(src_ip) ILIKE concat('%', {search: String}, '%') OR
                    src_country_name ILIKE concat('%', {search: String}, '%') OR
                    src_city ILIKE concat('%', {search: String}, '%') OR
                    user ILIKE concat('%', {search: String}, '%') OR
                    host ILIKE concat('%', {search: String}, '%')
                  )
                ORDER BY \`@timestamp\` DESC
                LIMIT {limit: UInt32} OFFSET {offset: UInt32};
            `,
            query_params: {
                tenant,
                limit,
                offset,
                search: search.trim(),
                severity,
            },
            format: 'JSONEachRow',
        })

        const data = (await result.json()) as LogItem[]
        return { success: true, data }
    } catch (error) {
        console.error("ClickHouse Query Error:", error)
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to fetch logs" 
        }
    }
}