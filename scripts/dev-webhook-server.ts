/**
 * ローカルテスト用 webhookサーバー
 * ポート 3001 で起動し、GAS（ngrok経由）からのPOSTを受け取って
 * content/site.json を書き換えます。
 * Next.js dev server (port 3000) がファイル変更を検知してホットリロードします。
 *
 * 起動: npm run webhook
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_JSON_PATH = path.join(__dirname, "..", "content", "site.json");
const PORT = 3001;
const SECRET = process.env.LOCAL_WEBHOOK_SECRET ?? "my-local-test-secret-2024";

const server = http.createServer((req, res) => {
  // CORS（GASからのリクエストに対応）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-local-secret");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // 動作確認用エンドポイント
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", message: "ローカルwebhookサーバー稼働中" }));
    return;
  }

  // メインエンドポイント
  if (req.method === "POST" && req.url === "/update-site") {
    // 認証チェック
    const authHeader = req.headers["x-local-secret"];
    if (authHeader !== SECRET) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      console.warn("❌ 認証失敗 (x-local-secret が一致しません)");
      return;
    }

    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        const formData: Record<string, string> = JSON.parse(body);

        // 現在のsite.jsonを読み込む
        const currentRaw = fs.readFileSync(SITE_JSON_PATH, "utf-8");
        const current = JSON.parse(currentRaw);

        // フォームデータをマージ
        const updated = mergeFormData(current, formData);
        updated._lastUpdated = new Date().toISOString();

        // ファイルに書き込む
        fs.writeFileSync(SITE_JSON_PATH, JSON.stringify(updated, null, 2), "utf-8");

        console.log("✅ site.json を更新しました:", updated._lastUpdated);
        console.log("   受信データ:", Object.keys(formData).filter(k => formData[k]).join(", "));

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, updatedAt: updated._lastUpdated }));
      } catch (err) {
        console.error("❌ エラー:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, () => {
  console.log(`\n🚀 ローカルwebhookサーバー起動中: http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/update-site`);
  console.log(`   認証キー (x-local-secret): ${SECRET}`);
  console.log(`\n📋 次のステップ:`);
  console.log(`   1. ngrok http ${PORT} を別ターミナルで実行`);
  console.log(`   2. 表示されたhttps://xxxx.ngrok-free.app URLをGASの`);
  console.log(`      SETTINGS.LOCAL_WEBHOOK_URL に設定（末尾に /update-site を付ける）`);
  console.log(`   3. GASから testLocalWebhook() を実行して確認\n`);
});

// ================================================================
// フォームデータ → site.json マージ関数
// ================================================================
function mergeFormData(
  data: Record<string, unknown>,
  form: Record<string, string>
): Record<string, unknown> {
  // ディープコピー
  const d = JSON.parse(JSON.stringify(data)) as Record<string, Record<string, unknown>>;

  const set = (
    obj: Record<string, unknown>,
    key: string,
    value: string | undefined
  ) => {
    if (value !== undefined && value !== "") obj[key] = value;
  };

  if (!d.clinic) d.clinic = {};
  set(d.clinic, "name", form["院名（整体院の名前）"]);
  set(d.clinic, "logoChar", form["ロゴ文字（1文字）"]);
  set(d.clinic, "description", form["院の説明文"]);

  if (!d.hero) d.hero = {};
  set(d.hero, "headline1", form["キャッチコピー（前半）"]);
  set(d.hero, "headline2", form["キャッチコピー（後半・強調）"]);
  set(d.hero, "subtext", form["ヒーロー説明文"]);

  if (!d.director) d.director = {};
  set(d.director, "name", form["院長名"]);
  set(d.director, "title", form["院長の肩書き"]);
  set(d.director, "qualifications", form["院長の資格"]);
  if (form["院長メッセージ（改行で段落分け）"]) {
    d.director.message = form["院長メッセージ（改行で段落分け）"]
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }

  if (!d.access) d.access = {};
  set(d.access, "postalCode", form["郵便番号（例：〒150-0000）"]);
  set(d.access, "address", form["住所"]);
  set(d.access, "nearestStation", form["最寄り駅・徒歩時間"]);
  set(d.access, "phone", form["電話番号（例：03-1234-5678）"]);
  set(d.access, "hours", form["営業時間（例：9:00 - 20:00）"]);
  set(d.access, "closedDays", form["定休日"]);
  set(d.access, "parkingNote", form["駐車場に関する説明"]);
  set(d.access, "googleMapsEmbedUrl", form["GoogleマップのiframeのsrcのURL"]);

  if (!d.contact) d.contact = {};
  set(d.contact, "lineUrl", form["LINEのURL"]);
  set(d.contact, "reservationFormUrl", form["WEB予約フォームのURL"]);
  set(d.contact, "instagramUrl", form["InstagramのURL"]);

  return d as Record<string, unknown>;
}
