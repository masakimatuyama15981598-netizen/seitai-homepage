/**
 * ================================================================
 * 整体院ホームページ - Google Apps Script
 * ================================================================
 * このスクリプトは「整体院情報設定フォーム」に回答が送信された際に
 * 自動で実行され、GitHubリポジトリの content/site.json を更新します。
 * site.json が更新されると、Cloudflare Pages が自動的に再ビルドします。
 *
 * 【セットアップ手順】
 * 1. Googleフォームを作成し、回答をスプレッドシートに記録する設定にする
 * 2. スプレッドシートの「拡張機能」→「Apps Script」でこのコードを貼り付ける
 * 3. 下記の SETTINGS の値を自分の環境に合わせて変更する
 * 4. 「トリガー」から onFormSubmit 関数を「フォーム送信時」に設定する
 * ================================================================
 */

// ================================================================
// ★ 設定項目（必ず変更してください）
// ================================================================
const SETTINGS = {
  // --- 本番用（GitHub経由でCloudflare Pagesを更新）---
  GITHUB_TOKEN: "ghp_xxxxxxxxxxxxxxxxxxxx", // GitHubのPersonal Access Token (repo権限)
  GITHUB_OWNER: "your-github-username",     // GitHubのユーザー名または組織名
  GITHUB_REPO: "seitai-homepage",           // リポジトリ名
  GITHUB_BRANCH: "main",                    // ブランチ名
  GITHUB_FILE_PATH: "content/site.json",   // 更新するファイルパス

  // --- ローカルテスト用（ngrok経由でlocalhostを更新）---
  // ngrok起動後に表示されるURLを設定（例: https://xxxx-xx-xx.ngrok-free.app）
  LOCAL_WEBHOOK_URL: "https://xxxx-xx-xx.ngrok-free.app/api/update-site",
  LOCAL_WEBHOOK_SECRET: "my-local-test-secret-2024", // .env.local の LOCAL_WEBHOOK_SECRET と一致させること
};
// ================================================================

/**
 * フォーム送信時に実行されるメイン関数
 * トリガー: フォーム送信時
 */
function onFormSubmit(e) {
  try {
    // スプレッドシートから最新回答を取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const values = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

    // ヘッダーと値をマッピング
    const formData = {};
    headers.forEach((header, index) => {
      formData[header] = values[index];
    });

    // 現在のsite.jsonをGitHubから取得
    const currentFile = getFileFromGitHub();
    const currentContent = JSON.parse(currentFile.content);

    // フォームデータをsite.jsonに反映
    const updatedContent = mergeFormDataToSiteJson(currentContent, formData);
    updatedContent._lastUpdated = new Date().toISOString();

    // GitHubへ更新をプッシュ
    updateFileOnGitHub(
      JSON.stringify(updatedContent, null, 2),
      currentFile.sha,
      "chore: フォームからサイト情報を更新 - " + new Date().toLocaleString("ja-JP")
    );

    Logger.log("✅ site.json の更新が完了しました");
  } catch (error) {
    Logger.log("❌ エラーが発生しました: " + error.toString());
    // エラー通知メール（任意）
    // MailApp.sendEmail("your-email@example.com", "サイト更新エラー", error.toString());
  }
}

/**
 * Googleフォームの回答をsite.jsonの構造に変換する
 * ※ フォームの質問文とこの関数内のキーを一致させてください
 */
function mergeFormDataToSiteJson(siteJson, formData) {
  const data = JSON.parse(JSON.stringify(siteJson)); // ディープコピー

  // ---- 基本情報 ----
  if (formData["院名（整体院の名前）"]) {
    data.clinic.name = formData["院名（整体院の名前）"];
  }
  if (formData["ロゴ文字（1文字）"]) {
    data.clinic.logoChar = formData["ロゴ文字（1文字）"];
  }
  if (formData["院の説明文"]) {
    data.clinic.description = formData["院の説明文"];
  }

  // ---- ヒーローセクション ----
  if (formData["キャッチコピー（前半）"]) {
    data.hero.headline1 = formData["キャッチコピー（前半）"];
  }
  if (formData["キャッチコピー（後半・強調）"]) {
    data.hero.headline2 = formData["キャッチコピー（後半・強調）"];
  }
  if (formData["ヒーロー説明文"]) {
    data.hero.subtext = formData["ヒーロー説明文"];
  }

  // ---- 院長情報 ----
  if (formData["院長名"]) {
    data.director.name = formData["院長名"];
  }
  if (formData["院長の肩書き"]) {
    data.director.title = formData["院長の肩書き"];
  }
  if (formData["院長の資格"]) {
    data.director.qualifications = formData["院長の資格"];
  }
  if (formData["院長メッセージ（改行で段落分け）"]) {
    data.director.message = formData["院長メッセージ（改行で段落分け）"]
      .split("\n")
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }

  // ---- アクセス情報 ----
  if (formData["郵便番号（例：〒150-0000）"]) {
    data.access.postalCode = formData["郵便番号（例：〒150-0000）"];
  }
  if (formData["住所"]) {
    data.access.address = formData["住所"];
  }
  if (formData["最寄り駅・徒歩時間"]) {
    data.access.nearestStation = formData["最寄り駅・徒歩時間"];
  }
  if (formData["電話番号（例：03-1234-5678）"]) {
    data.access.phone = formData["電話番号（例：03-1234-5678）"];
  }
  if (formData["営業時間（例：9:00 - 20:00）"]) {
    data.access.hours = formData["営業時間（例：9:00 - 20:00）"];
  }
  if (formData["定休日"]) {
    data.access.closedDays = formData["定休日"];
  }
  if (formData["駐車場に関する説明"]) {
    data.access.parkingNote = formData["駐車場に関する説明"];
  }
  if (formData["GoogleマップのiframeのsrcのURL"]) {
    data.access.googleMapsEmbedUrl = formData["GoogleマップのiframeのsrcのURL"];
  }

  // ---- 予約・連絡先 ----
  if (formData["LINEのURL"]) {
    data.contact.lineUrl = formData["LINEのURL"];
  }
  if (formData["WEB予約フォームのURL"]) {
    data.contact.reservationFormUrl = formData["WEB予約フォームのURL"];
  }
  if (formData["InstagramのURL"]) {
    data.contact.instagramUrl = formData["InstagramのURL"];
  }

  return data;
}

// ================================================================
// GitHub API ユーティリティ関数
// ================================================================

function getFileFromGitHub() {
  const url = `https://api.github.com/repos/${SETTINGS.GITHUB_OWNER}/${SETTINGS.GITHUB_REPO}/contents/${SETTINGS.GITHUB_FILE_PATH}?ref=${SETTINGS.GITHUB_BRANCH}`;

  const response = UrlFetchApp.fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + SETTINGS.GITHUB_TOKEN,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const json = JSON.parse(response.getContentText());

  return {
    sha: json.sha,
    content: Utilities.newBlob(
      Utilities.base64Decode(json.content.replace(/\n/g, ""))
    ).getDataAsString(),
  };
}

function updateFileOnGitHub(newContentString, sha, commitMessage) {
  const url = `https://api.github.com/repos/${SETTINGS.GITHUB_OWNER}/${SETTINGS.GITHUB_REPO}/contents/${SETTINGS.GITHUB_FILE_PATH}`;

  const encodedContent = Utilities.base64Encode(
    Utilities.newBlob(newContentString).getBytes()
  );

  const payload = {
    message: commitMessage,
    content: encodedContent,
    sha: sha,
    branch: SETTINGS.GITHUB_BRANCH,
  };

  UrlFetchApp.fetch(url, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + SETTINGS.GITHUB_TOKEN,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    payload: JSON.stringify(payload),
  });
}

/**
 * 本番テスト用：GitHub経由で手動更新を確認する
 */
function testManualUpdate() {
  const testData = {
    "院名（整体院の名前）": "テスト整体院",
    "電話番号（例：03-1234-5678）": "03-9999-9999",
  };

  const currentFile = getFileFromGitHub();
  const currentContent = JSON.parse(currentFile.content);
  const updatedContent = mergeFormDataToSiteJson(currentContent, testData);
  updatedContent._lastUpdated = new Date().toISOString();

  updateFileOnGitHub(
    JSON.stringify(updatedContent, null, 2),
    currentFile.sha,
    "test: 手動テスト更新"
  );

  Logger.log("✅ テスト更新完了");
}

// ================================================================
// ローカルテスト用関数
// SETTINGS.LOCAL_WEBHOOK_URL と LOCAL_WEBHOOK_SECRET を設定した上で
// onFormSubmit の代わりに onFormSubmitLocal をトリガーに設定する
// ================================================================

/**
 * ローカルテスト用フォーム送信ハンドラ
 * ngrok経由でlocalhost:3000/api/update-site にデータを送る
 */
function onFormSubmitLocal(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const values = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

    const formData = {};
    headers.forEach(function(header, index) {
      formData[header] = values[index];
    });

    sendToLocalWebhook(formData);
  } catch (error) {
    Logger.log("❌ エラー: " + error.toString());
  }
}

/**
 * ローカルwebhookへPOSTする
 */
function sendToLocalWebhook(formData) {
  const response = UrlFetchApp.fetch(SETTINGS.LOCAL_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-local-secret": SETTINGS.LOCAL_WEBHOOK_SECRET,
    },
    payload: JSON.stringify(formData),
    muteHttpExceptions: true,
  });

  Logger.log("📡 レスポンス: " + response.getResponseCode() + " " + response.getContentText());
}

/**
 * GASエディタから手動実行でローカルテストを確認する
 * ※ ngrokが起動中で SETTINGS.LOCAL_WEBHOOK_URL が設定済みであること
 */
function testLocalWebhook() {
  const testData = {
    "院名（整体院の名前）": "テスト整体院【ローカル】",
    "電話番号（例：03-1234-5678）": "03-8888-8888",
    "住所": "東京都テスト区テスト町 1-2-3",
    "定休日": "火曜日・木曜日",
  };

  sendToLocalWebhook(testData);
  Logger.log("✅ ローカルwebhookテスト送信完了");
}
