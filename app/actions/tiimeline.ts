"use server";

import { clickhouse } from "@/lib/clickhouse";

export type TimelineData = {
  day: string;
  total_events: number;
  error_events: number;
};

export async function getTimeLine(days: number): Promise<TimelineData[]> {
  const result = await clickhouse.query({
    query: `
        SELECT 
            toDate(\`@timestamp\`) AS day,
            count() AS total_events,
            sum(if(status_code >= 400 OR severity >= 7, 1, 0)) AS error_events
        FROM central_logs
        WHERE \`@timestamp\` >= (SELECT max(\`@timestamp\`) FROM central_logs) - INTERVAL ${Number(days)} DAY
        GROUP BY day
        ORDER BY day ASC;
    `,
    format: "JSONEachRow",
  });

  const rows = await result.json<TimelineData>();

  // console.log(rows);

  return rows;
}