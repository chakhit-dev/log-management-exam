"use server"

import { clickhouse } from "@/lib/clickhouse";

export type BlockedData = {
    total_blocked:number;
    waf_count:number;
    rate_limit_count:number;
}

export async function getBlockedRequest(): Promise<BlockedData> {
    const result = await clickhouse.query({
        query: `
            SELECT 
                count() AS total_blocked,
                sum(if(status_code = 403 OR event_type LIKE '%waf%' OR event_type LIKE '%deny%', 1, 0)) AS waf_count,
                sum(if(status_code = 429 OR event_type LIKE '%rate_limit%' OR event_type LIKE '%ratelimit%', 1, 0)) AS rate_limit_count

            FROM central_logs
            WHERE \`@timestamp\` >= (SELECT max(\`@timestamp\`) FROM central_logs) - INTERVAL 1 HOUR
            AND (status_code IN (403, 429) OR event_type LIKE '%deny%' OR event_type LIKE '%waf%' OR event_type LIKE '%rate_limit%');
        `,
        format: "JSONEachRow",
    });

    const rows = await result.json<BlockedData>();

    return rows[0] ?? {
        total_blocked: 0,
        waf_count: 0,
        rate_limit_count: 0
    }
}