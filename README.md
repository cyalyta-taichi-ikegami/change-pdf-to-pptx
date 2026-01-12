# 📄 PDF to Google Slides Converter (GAS)

この Google Apps Script (GAS) プロジェクトは、PDF ファイルを Google スライド プレゼンテーションに変換するツールです。Web ベースのインターフェースを備えており、アップロードされた PDF はクライアントサイド (`pdf.js`) で画像に変換され、その後 Google ドライブにアップロードされてスライドが作成されます。

## 機能

*   **Web インターフェース**: ファイルの選択とアップロードを行うシンプルな HTML/JS フロントエンド。
*   **クライアントサイド処理**: ブラウザ内で `pdf.js` を使用して PDF ページを画像に変換します。これによりサーバーの負荷を軽減し、GAS のいくつかの制限を回避しています。
*   **GAS バックエンド**: 新しい Google スライド プレゼンテーションを作成し、変換された画像をスライドとして追加します。

## 前提条件

*   Node.js および npm がインストールされていること。
*   Google アカウント。

## セットアップ

1.  **依存関係のインストール**
    ```bash
    npm install
    ```

2.  **Google 認証**
    ```bash
    npx clasp login
    ```

## 開発

### ディレクトリ構成

*   `src/Code.js`: サーバーサイド Google Apps Script コード。
*   `src/index.html`: クライアントサイド HTML および JavaScript。
*   `.clasp.json`: Clasp 設定ファイル。

### Clasp コマンド

*   **Google ドライブへ変更をプッシュ**:
    ```bash
    npx clasp push
    ```

*   **リモート環境でプロジェクトを開く**:
    ```bash
    npx clasp open
    ```

*   **Web アプリとしてデプロイ**:
    スクリプトエディタからデプロイするか、コマンドラインを使用できます:
    ```bash
    npx clasp deploy --description "Initial Deploy"
    ```

## 使い方

1.  GAS プロジェクトにコードをプッシュします:
    ```bash
    npx clasp push
    ```
2.  プロジェクトを開きます:
    ```bash
    npx clasp open
    ```
3.  Apps Script エディタで、プロジェクトを web アプリとしてデプロイします:
    *   **デプロイ** > **新しいデプロイ** をクリックします。
    *   **種類の選択** で **ウェブアプリ** を選択します。
    *   **次のユーザーとして実行** を "自分" (Me) に設定します。
    *   **アクセスできるユーザー** を "Google アカウントを持つ全員" (Anyone with Google account) または好みの設定にします。
    *   **デプロイ** をクリックします。
4.  提供された **ウェブアプリの URL** を開きます。
5.  PDF ファイルを選択し、**Convert** (変換) をクリックします。
6.  完了したら、**Open Slides** リンクをクリックして、作成されたプレゼンテーションを表示します。

## GitHub Actions による自動デプロイ

このプロジェクトには、GitHub の `main` ブランチにプッシュされたときに自動的に GAS へデプロイするワークフローが含まれています。

### 設定手順

1.  **Clasp の認証情報を取得する**:
    ローカル環境でログイン済みの場合、ログイン情報は `~/.clasprc.json` (Windows では `C:\Users\ユーザー名\.clasprc.json`) に保存されています。
    このファイルの内容を全コピーしてください。

2.  **GitHub Secrets に登録する**:
    *   GitHub リポジトリ設定の **Settings** > **Secrets and variables** > **Actions** に移動します。
    *   **New repository secret** をクリックします。
    *   **Name**: `CLASP_SECRET`
    *   **Secret**: コピーした `.clasprc.json` の内容を貼り付けます。
    *   **Add secret** をクリックして保存します。

詳しく設定が完了すると、`main` ブランチへのプッシュ時に自動的に `clasp push` が実行されます。

