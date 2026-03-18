# 整体院ホームページ テンプレート

Googleフォームで入力した内容が自動的にサイトに反映される、整体院向けNext.jsホームページテンプレートです。

---

## システム構成

```
Googleフォーム（クライアントが入力）
        ↓ 送信
Google Sheets（回答が自動記録）
        ↓ Apps Script が起動
Google Apps Script
        ↓ GitHub API で site.json を更新
GitHubリポジトリ（content/site.json が変わる）
        ↓ push検知 → GitHub Actions が起動
Cloudflare Pages（自動ビルド＆デプロイ）
        ↓
公開サイト（最新情報に更新済み）
```

---

## ローカル開発

```bash
npm install
npm run dev
# http://localhost:3000 で確認
```

---

## サイト内容の編集

`content/site.json` を直接編集することで、サイトのすべての内容を変更できます。

| フィールド | 内容 |
|---|---|
| `clinic.name` | 院名 |
| `clinic.logoChar` | ヘッダーロゴの文字（1文字） |
| `hero` | ファーストビューのテキスト・画像 |
| `concept.items` | こだわりの3項目 |
| `menu.items` | 施術メニュー（名前・時間・料金・説明） |
| `director` | 院長情報・メッセージ |
| `access` | 住所・電話・営業時間・Googleマップ |
| `contact` | LINE URL・予約フォームURL・Instagram |

---

## Googleフォーム連携のセットアップ

### 1. Googleフォームを作成する

以下の質問を作成してください（**質問文は完全一致させること**）：

**基本情報**
- 院名（整体院の名前）
- ロゴ文字（1文字）
- 院の説明文

**ヒーローセクション**
- キャッチコピー（前半）
- キャッチコピー（後半・強調）
- ヒーロー説明文

**院長情報**
- 院長名
- 院長の肩書き
- 院長の資格
- 院長メッセージ（改行で段落分け）

**アクセス情報**
- 郵便番号（例：〒150-0000）
- 住所
- 最寄り駅・徒歩時間
- 電話番号（例：03-1234-5678）
- 営業時間（例：9:00 - 20:00）
- 定休日
- 駐車場に関する説明
- GoogleマップのiframeのsrcのURL

**予約・連絡先**
- LINEのURL
- WEB予約フォームのURL
- InstagramのURL

### 2. スプレッドシートと連携する

フォームの「回答」→「スプレッドシートにリンク」で新しいシートを作成

### 3. Google Apps Scriptを設定する

1. スプレッドシートを開き「拡張機能」→「Apps Script」
2. `scripts/google-apps-script.gs` の内容を貼り付ける
3. ファイル冒頭の `SETTINGS` を自分の環境に合わせて変更

```javascript
const SETTINGS = {
  GITHUB_TOKEN: "ghp_xxxx",        // GitHubのPersonal Access Token
  GITHUB_OWNER: "your-username",   // GitHubのユーザー名
  GITHUB_REPO: "seitai-homepage",  // リポジトリ名
  GITHUB_BRANCH: "main",
  GITHUB_FILE_PATH: "content/site.json",
};
```

4. 「トリガー」(時計アイコン)から新しいトリガーを追加
   - 関数: `onFormSubmit`
   - イベントのソース: スプレッドシートから
   - イベントの種類: フォーム送信時

### 4. GitHubのPersonal Access Tokenを発行する

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token (classic)」
3. スコープは `repo` にチェック
4. 発行されたトークンを `SETTINGS.GITHUB_TOKEN` に設定

---

## GitHubへのデプロイ

```bash
git init
git add .
git commit -m "初回コミット"
git remote add origin https://github.com/your-username/seitai-homepage.git
git push -u origin main
```

---

## Cloudflare Pagesのセットアップ

### GitHub Actionsを使う場合（推奨）

1. Cloudflare ダッシュボード → Workers & Pages → Create → Pages
2. 「Direct Upload」でプロジェクトを作成（名前: `seitai-homepage`）
3. Cloudflare API Token を発行（Zone:Read, Account:Read, Pages:Edit 権限）
4. GitHubリポジトリの Settings → Secrets and variables → Actions に追加：
   - `CLOUDFLARE_API_TOKEN`: CloudflareのAPIトークン
   - `CLOUDFLARE_ACCOUNT_ID`: CloudflareのアカウントID

### GitHubリポジトリをCloudflareに直接連携する場合

1. Cloudflare ダッシュボード → Workers & Pages → Create → Pages → Connect to Git
2. GitHubリポジトリを選択
3. ビルド設定：
   - フレームワーク: Next.js (Static HTML Export)
   - ビルドコマンド: `npm run build`
   - 出力ディレクトリ: `out`
4. 「Save and Deploy」

この方法の場合、`.github/workflows/deploy.yml` は不要です。

---

## Googleマップのiframeのsrcの取得方法

1. Google マップで院の住所を検索
2. 「共有」→「地図を埋め込む」→「HTMLをコピー」
3. コピーしたHTMLの `src="..."` の部分のURLのみをフォームに入力

例：
```
https://www.google.com/maps/embed?pb=!1m18!1m12!...
```
