---
title: Class C 規約
description: FPM CSS Coding Conventions の Class C 規約（AI/レビューで担保する助言的ルール）です。
sidebar:
  label: Class C 規約
---

<!-- GENERATED — DO NOT EDIT -->

Version: `1.2.0` / Rules: 5 (Class C; all rules: A12 / B5 / C5)

linter では強制せず、AI生成時とレビューで担保する。

[規約リファレンスに戻る](../)

## Naming

### CSS-NAMING-002: クラス名は役割・意味・構造を表す（見た目ベース命名禁止）

- Class: `C`
- Level: `advisory`
- Category: `naming`
- stylelintRule: `null`

**概要**

クラス名は要素の役割・意味・構造を表す。見た目・装飾ベースの命名 （.column-6, .red, .text-large, .margin20, .floated 等）は禁止。

**根拠**

デザイン変更時にHTMLを触らずに済ませ、スタイルと命名のズレを防ぐため。

**Good**

```text
<section class="main-section">
  <h1 class="main-section-title">…</h1>
</section>
```

**Bad**

```text
<div class="column-6 margin20 floated">
  <h1 class="red text-large">…</h1>
</div>
```

**AI/レビューで見る点**

クラス名は「何であるか（役割・意味・構造）」で付ける。色・サイズ・余白・ レイアウト値など見た目を表す語（red, large, column-6, margin20, floated 等）を 名前に使わない。linter では捕まえられないため生成時に必ず自分で守る。

## Prefix

### CSS-PREFIX-003: JS用IDは x 始まりcamelCase、CSSで使用禁止

- Class: `C`
- Level: `advisory`
- Category: `prefix`
- stylelintRule: `null`

**概要**

JS用IDは xSomeElement のように x 始まり camelCase で命名し、CSS側では使用しない。

**根拠**

JS参照点をCSSから分離し、命名で用途を明示するため。

**Good**

```text
<!-- HTML/JS側 -->
<div id="xSomeElement"></div>
```

**Bad**

```text
#xSomeElement { color: red; }  /* CSS側での使用 */
```

**AI/レビューで見る点**

JS用ID は xSomeElement のように x 始まり camelCase で付ける。CSS からは ID を 一切参照しない（CSS側のID禁止は CSS-PROHIBIT-001 が担保）。命名自体は HTML/JS 側の規約。

## Variables

### CSS-VAR-005: 変数名は「prefix > 種別 > 細分類」の順

- Class: `C`
- Level: `advisory`
- Category: `variables`
- stylelintRule: `null`

**概要**

変数名の構成順は 接頭辞 > 種別（color/font/height 等） > 細分類。 例: --v-color-text, --v-height-header。

**根拠**

変数名の並びを規則化し、補完・一覧性を高めるため。

**Good**

```text
--v-font-text: sans-serif;
--v-color-text: #333;
--v-height-header: 60px;
```

**Bad**

```text
--v-text-color: #333;   /* 種別と細分類が逆 */
```

**AI/レビューで見る点**

変数名は「接頭辞 > 種別 > 細分類」で組む。種別語（color/font/height 等）を第2セグメントに 置く（--v-color-text であって --v-text-color ではない）。linter 対象外なので生成時に守る。

## Responsive

### CSS-RESP-001: @custom-media 定義 + ネスト @media で指定

- Class: `C`
- Level: `advisory`
- Category: `responsive`
- stylelintRule: `null`

**概要**

ブレークポイントは @custom-media --v-screen-xs (width <= 360px); のように定義し、各クラス内に ネストした @media (--v-screen-xs) { … } で指定する。同一クラスのレスポンシブ指定は同一箇所に集約。

**根拠**

ブレークポイントを変数化して一元管理し、レスポンシブ定義を対象クラスに集約するため。

**Good**

```text
.some-class {
  color: red;
  @media (--v-screen-xs) { color: green; }
}
```

**Bad**

```text
@media (max-width: 360px) {
  .some-class { color: green; }   /* 生の値・クラス外定義 */
}
```

**AI/レビューで見る点**

ブレークポイントは @custom-media で --v-screen-* として定義し、参照する。生のメディア特性 （max-width: 360px 等）を直書きせず、レスポンシブ指定は対象クラス内にネストして集約する。 root 直下の @media 配置は CSS-RESP-002 が Stylelint で検査する。

## JS Integration

### CSS-JS-001: JSからのスタイル変更は .mode- 付与で行う

- Class: `C`
- Level: `advisory`
- Category: `js-integration`
- stylelintRule: `null`

**概要**

JS側でのスタイル変更は .mode- クラスの付け外しで行う。.show() / .css({...}) / 汎用 addClass('show') による直接スタイル操作は禁止。

**根拠**

スタイル制御をCSSの .mode- 定義に集約し、JSに散らさないため。

**Good**

```text
$('.x-list-item').addClass('mode-show');
```

**Bad**

```text
$('.x-list-item').show();
$('.x-list-item').css({ display: 'block' });
$('.x-list-item').addClass('show');
```

**AI/レビューで見る点**

JS からスタイルを変えるときは .mode- クラスを付け外しする。.show()/.hide()/.css() や 汎用的な addClass('show') で直接スタイルを操作しない。JS側の規約なので CSS linter 対象外。
