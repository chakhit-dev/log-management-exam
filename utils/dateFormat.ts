export function formatThaiTime(value?: string | number) {
  if (!value) return "-";

  let raw: string | number = value;
  if (
    typeof value === "string" &&
    !/(Z|[+-]\d{2}:?\d{2})$/i.test(value)
  ) {
    raw = value.replace(" ", "T") + "Z";
  }

  const date = new Date(raw);
  if (isNaN(date.getTime())) return String(value);

  return (
    date
      .toLocaleString("sv-SE", {
        timeZone: "Asia/Bangkok",
        hour12: false,
      })
      .replace(",", "") +
    "." +
    String(date.getUTCMilliseconds()).padStart(3, "0")
  );
}