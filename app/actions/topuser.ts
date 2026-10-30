
"use server";

import { clickhouse } from "@/lib/clickhouse";

export type TopUserData = {
  user: string;
  event_count: number;
};

export type TopUserDataProps = {
  data: TopUserData[] | null;
};

export async function getTopUser(): Promise<TopUserData[]> {
  const result = await clickhouse.query({
    query: `
        SELECT 
            user,
            count() AS event_count
        FROM central_logs
        WHERE \`@timestamp\` >= (SELECT max(\`@timestamp\`) FROM central_logs) - INTERVAL 1 HOUR
        AND user != '' AND user IS NOT NULL
        GROUP BY user
        ORDER BY event_count DESC
        LIMIT 5;
    `,
    format: "JSONEachRow",
  });

  const rows = await result.json<TopUserData>();

  // console.log(rows)

  return rows;
}
