---
title: はじめに
description: stylelint-config-fpm と Claude Code / Codex skill の導入手順。
sidebar:
  order: 2
  label: はじめに
---

## 前提

FPMではCSSファイルを細かくファイル分割する必要があるため、lightningCSSやpostcss-importなど、複数のCSSファイルをbundleして結合できるビルド環境が必要です。ビルド環境の構築は、各プロジェクトの方針に従ってください。

標準的なソース構成例は次の通りです。

```
assets/
├─ css/
│   ├─ style.css       // @importのみを並べたエントリーファイル（lint対象外）
|   ├─ vendor/				 // 外部ライブラリのCSS（lint対象外）
│   └─ src/            // このフォルダ内にCSSの中身を置く（lint対象）
│       ├─ _header.css // .header / .header-* のclassを書く
│       ├─ _footer.css
│       ├─ _button.css
│       ├─ _g.css
│       └─ _v.css
└─ js/
```

## 導入パターン

FPMでは、CSS規約をClass A/B/Cの3分類に分けています。
重要度の高いClass A/BのルールはStylelintで機械的に検査することができます。
Class Cのルールは機械的に判断できない内容なため、LLM用のSkillの形で提供されます。AI生成時やレビュー時に活用ください。

| パターン                           | 入れるもの                                                   | 得られること                                         | 機械検査                                      |
| ---------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- | --------------------------------------------- |
| (1) Stylelint + プロジェクト skill | npm `stylelint` + `stylelint-config-fpm`、プロジェクト skill | Class A/BをStylelintが検査し、AIが全22規約を参照する | あり（A/B）                                   |
| (2) プロジェクト skillのみ         | プロジェクト skill                                           | AIが全22規約を参照する                               | なし                                          |
| (3) グローバル skill               | Claude CodeまたはCodexのグローバル skill                     | 全プロジェクトでAIが全22規約を参照する               | なし（Stylelintは各プロジェクトで任意に追加） |

Stylelintは任意です。導入しない場合もskillは全22規約（A12 / B5 / C5）をAIに提供しますが、Class A/Bの機械検査は行われません。

## パターン (1): Stylelint設定を使う

パターン (1) では、利用側のプロジェクトにStylelint本体と `stylelint-config-fpm` を追加します。パターン (3) のグローバルskillと併用することもできます。

```sh
pnpm add -D stylelint stylelint-config-fpm
```

次に、`stylelint-config-fpm` をStylelint設定に追加します。

```js
module.exports = {
	extends: ["stylelint-config-fpm"],
};
```

この設定は `stylelint-plugin-fpm` の独自ルールも含め、Class A/Bのルールを検査します。CSSを書いた後は、対象ファイルまたはプロジェクト全体にStylelintを実行してください。

```sh
npx stylelint "src/**/*.css"
```

## skillを使う

[FPMのGitHubリポジトリ](https://github.com/zk33/fpm-css)をコピー元として取得します。ローカルのコピー元パスを `<fpm-source>` とする場合は、次を実行します。

```sh
git clone https://github.com/zk33/fpm-css.git <fpm-source>
```

パターン (1) と (2) はプロジェクトskill、パターン (3) はグローバルskillを使います。Claude CodeとCodexは同じskillディレクトリを使い、配置先だけが異なります。

| ツール      | プロジェクト skill        | グローバル skill                |
| ----------- | ------------------------- | ------------------------------- |
| Claude Code | `.claude/skills/fpm-css/` | `~/.claude/skills/fpm-css/`     |
| Codex       | `.agents/skills/fpm-css/` | `$HOME/.agents/skills/fpm-css/` |

使う配置先に合わせて、コピー元の `fpm-css` ディレクトリをその親ディレクトリへコピーします。

```sh
# Claude Code: プロジェクト skill
mkdir -p .claude/skills
cp -R <fpm-source>/.claude/skills/fpm-css .claude/skills/

# Claude Code: グローバル skill
mkdir -p ~/.claude/skills
cp -R <fpm-source>/.claude/skills/fpm-css ~/.claude/skills/

# Codex: プロジェクト skill
mkdir -p .agents/skills
cp -R <fpm-source>/.claude/skills/fpm-css .agents/skills/

# Codex: グローバル skill
mkdir -p $HOME/.agents/skills
cp -R <fpm-source>/.claude/skills/fpm-css $HOME/.agents/skills/
```

skillはCSSを生成、修正、レビューする作業で規約ダイジェストと詳細リファレンスを提供します。詳細なgood/bad例は、skillに同梱される `references/css-convention.md` を参照してください。

## Stylelintを導入しない場合

パターン (2) と (3) では、skillが全22規約をAIに提供しますが、Class A/Bの機械検査は行われません。skill内のStylelint検査手順は、Stylelint未導入の環境では実行できません。Stylelintを後から追加するか、Class A/Bもレビューで確認してください。│
