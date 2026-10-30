
"use server";

import { clickhouse } from "@/lib/clickhouse";

export type TopEventTypeData = {
  event_type: string;
  event_count: number;
};

export type TopEventTypeProps = {
  data: TopEventTypeData[] | null;
};

export async function getTopEventType(): Promise<TopEventTypeData[]> {
  const result = await clickhouse.query({
    query: `
        SELECT 
            event_type,
            count() AS event_count
        FROM central_logs
        WHERE \`@timestamp\` >= (SELECT max(\`@timestamp\`) FROM central_logs) - INTERVAL 1 HOUR
        AND event_type != '' AND event_type IS NOT NULL
        GROUP BY event_type
        ORDER BY event_count DESC
        LIMIT 5;
    `,
    format: "JSONEachRow",
  });

  const rows = await result.json<TopEventTypeData>();

  console.log(rows)

  return rows;
}
