import { parse } from "jsr:@std/csv";

const decoder = new TextDecoder("utf-8");
const a = await Deno.readFile("data/2024.csv").then((data) =>
  decoder.decode(data)
);

const data = parse(a, { skipFirstRow: true, strip: true });
const w2024 = data.map((a) => {
  return ({
    title: a["動画タイトル"],
    url: a["動画URL"],
    count: parseInt(a["票数"].slice(0, -1), 10),
    type: estimateType(a["動画URL"]),
  });
});

await Deno.writeFile(
  "pages/data.json",
  new TextEncoder().encode(JSON.stringify({
    2024: w2024,
  })),
);

function estimateType(
  vurl: string,
):
  | "nicovideo"
  | "nicovideo-live"
  | "youtube"
  | "twitter"
  | "bilibili"
  | "soundcloud"
  | "linevoom"
  | "unknown" {
  if (vurl === null) return "unknown";

  switch (new URL(vurl).host) {
    case "www.nicovideo.jp":
      return "nicovideo";

    case "live.nicovideo.jp":
      return "nicovideo-live";

    case "www.youtube.com":
    case "m.youtube.com":
    case "youtu.be":
      return "youtube";

    case "twitter.com":
    case "www.twitter.com":
    case "x.com":
      return "twitter";

    case "bilibili.com":
    case "www.bilibili.com":
      return "bilibili";

    case "soundcloud.com":
      return "soundcloud";

    case "linevoom.line.me":
      return "linevoom";

    default:
      return "unknown";
  }
}
