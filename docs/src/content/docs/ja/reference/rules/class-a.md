---
title: Class A 規約
description: FPM CSS Coding Conventions の Class A 規約（FPM固有の機械強制ルール）です。
sidebar:
  label: Class A 規約
---

<!-- GENERATED — DO NOT EDIT -->

Version: `1.2.0` / Rules: 12 (Class A; all rules: A12 / B5 / C5)

`stylelint-plugin-fpm` の独自ルールで機械強制する。

[規約リファレンスに戻る](../)

## File Structure

### CSS-FILE-001: クラス名の先頭部＝ファイル名に一致【超重要】

- Class: `A`
- Level: `error`
- Category: `file-structure`
- stylelintRule: `fpm/selector-file-prefix`

**概要**

_header.css には .header および .header-*（先頭部が header）で始まるクラスのみを 記述する。ファイル名と先頭部（最初のハイフンまで）が一致しないクラス定義を禁止。

**根拠**

クラス名を見た瞬間に定義ファイルが判明し、重複定義による上書き事故を防ぐ（規約の中核）。

**Good**

```text
/* _header.css */
.header {}
.header-logo {}
.header-nav {}
```

**Bad**

```text
/* _header.css */
.my-awesome-header {}
.alternative-header {}
```

**AI/レビューで見る点**

新規クラスはそのファイル名の先頭部で始める。_header.css では .header または .header-* のみ定義し、別モジュール名（.my-awesome-header 等）で書き始めない。 `.g-` / `.x-` / `.mode-` 接頭辞クラスと _g.css / _v.css は対象外。

### CSS-FILE-002: @keyframes 名もファイル名に合わせる

- Class: `A`
- Level: `error`
- Category: `file-structure`
- stylelintRule: `fpm/keyframes-file-prefix`

**概要**

@keyframes 等アニメーション名を含む全ての命名を、そのファイル名（＝クラス先頭部）と 連動させる。

**根拠**

命名からファイル位置を辿れる原則をアニメーション名にも一貫適用するため。

**Good**

```text
/* _header.css */
@keyframes header-fade-in { … }
```

**Bad**

```text
/* _header.css */
@keyframes fadeIn { … }
```

**AI/レビューで見る点**

@keyframes 名もファイル名の先頭部で始める。_header.css なら header-fade-in のように 付け、fadeIn のようなファイル名非連動の名前にしない。

## Prefix

### CSS-PREFIX-001: グローバルクラスは .g-、_g.css に置く

- Class: `A`
- Level: `error`
- Category: `prefix`
- stylelintRule: `fpm/global-class-file`

**概要**

複数箇所で上書きして使い回すグローバルクラスは .g- 接頭辞にし、_g.css に定義する。 _g.css 以外で .g- をスタイル対象となる主語 compound に置けるのは、ローカルクラス内の 子側主語として1階層ネストする場合だけ。ローカルクラスが主語なら、.g- は文脈や pseudo-class の引数として参照できる。単純に再利用するだけの共通要素は要素名命名にする。

**根拠**

「編集に注意が必要な共有物」を接頭辞とファイルで可視化するため。

**Good**

```text
/* _g.css */
.g-btn { … }
.g-input-text { … }
/* _card.css */
.card { .g-btn { … } }
.card:has(.g-btn) { … }
```

**Bad**

```text
/* _header.css */
.g-btn { … }   /* _g.css 以外での .g- 定義 */
```

**AI/レビューで見る点**

使い回すグローバルクラスだけ .g- を付け、必ず _g.css に定義する。_g.css 以外で .g- をスタイル対象のルート主語に新規定義しない。例外はローカルクラス内の子側主語としての 1階層ネストだけ。ローカルクラスが主語なら .g- は文脈や pseudo-class の引数にだけ参照できる。 単なる共通要素は要素名（.header- 等）で命名する。

### CSS-PREFIX-002: JS用クラス .x- はCSSでスタイル指定禁止

- Class: `A`
- Level: `error`
- Category: `prefix`
- stylelintRule: `fpm/no-x-class-style`

**概要**

JS操作用クラスは .x- 接頭辞にし、CSS側でスタイル（宣言ブロック）を持たせない。

**根拠**

JS操作対象とCSSスタイル対象を分離し、意図しないスタイル変更を防ぐため。

**Good**

```text
/* スタイルは非 .x- クラスで */
.list-item { color: red; }
```

**Bad**

```text
.x-list-element { color: red; }
```

**AI/レビューで見る点**

.x- クラスは JS のフック専用。CSS で .x- に宣言（color 等）を付けない。 スタイルは別の意味クラスに書く。

### CSS-PREFIX-004: .mode- は他クラスへの連結形式のみ（単独/子孫単独禁止）

- Class: `A`
- Level: `error`
- Category: `prefix`
- stylelintRule: `fpm/mode-class-compound`

**概要**

状態・バリエーション用 .mode- クラスはファイル名一致不要だが単独使用禁止。必ず他クラスに 連結（.my-btn.mode-disabled、または .my-btn { &.mode-disabled {} }）して使う。 子孫セレクタ内での単独 .mode- も禁止。

**根拠**

状態クラスを必ず対象クラスに束ね、どの要素の状態かを明示するため。

**Good**

```text
.my-btn.mode-disabled { … }
.my-btn { &.mode-disabled { … } }
```

**Bad**

```text
.mode-disabled { … }
.my-btn .mode-disabled { … }
```

**AI/レビューで見る点**

.mode- は必ず対象クラスと同一 compound で連結する（.btn.mode-active など）。 .mode- 単独や子孫としての単独（.parent .mode-x）で書かない。

## Variables

### CSS-VAR-002: グローバル変数は _v.css の :root に --v- で定義

- Class: `A`
- Level: `error`
- Category: `variables`
- stylelintRule: `fpm/global-var-contract`

**概要**

グローバル変数は _v.css に記述し、--v- 接頭辞、:root セレクタで定義する。逆に --v- 変数は _v.css の :root 以外で新規定義しない（モジュール側での参照は可）。

**根拠**

グローバル変数の定義箇所を一意に固定し、上書き源を明確化するため。

**Good**

```text
/* _v.css */
:root {
  --v-color-text: #333;
  --v-radius: 5px;
}
```

**Bad**

```text
/* _header.css */
:root { --v-color-text: #333; }   /* _v.css 以外での --v- 定義 */
```

**AI/レビューで見る点**

--v- はグローバル専用。定義は _v.css の :root だけに置く。他ファイルやモジュール内で --v- を新規定義しない（参照 var(--v-…) は可）。

### CSS-VAR-003: 変数名もファイル名と一致

- Class: `A`
- Level: `error`
- Category: `variables`
- stylelintRule: `fpm/custom-property-file-prefix`

**概要**

_header.css に定義するモジュール変数は --header-*（先頭部＝ファイル名）のみ。 --v-（グローバル）を除く。

**根拠**

変数名からも定義ファイルを辿れるようにするため。

**Good**

```text
/* _header.css */
--header-color: #999;
```

**Bad**

```text
/* _header.css */
--color-of-header: #999;
```

**AI/レビューで見る点**

モジュール変数名はファイル名の先頭部で始める（_header.css なら --header-*）。 --v- グローバル変数はこの対象外。

### CSS-VAR-004: モジュール変数はファイル名同名クラス内に定義

- Class: `A`
- Level: `error`
- Category: `variables`
- stylelintRule: `fpm/module-var-owner`

**概要**

モジュール単位の変数は :root ではなく、ファイル名と同名のクラス（_header.css なら .header） の中に定義する。--v- グローバル変数はモジュール内で定義しない（採用決定: --v- は _v.css/:root 専用）。

**根拠**

変数のスコープを対象モジュールに閉じ、影響範囲を限定するため。

**Good**

```text
/* _header.css */
.header { --header-color-text: #333; }
```

**Bad**

```text
/* _header.css */
:root { --header-color-text: #333; }
.header { --v-header-height: 30px; }   /* モジュール内での --v- 定義は違反 */
```

**AI/レビューで見る点**

モジュール変数はファイル同名クラス（.header）のブロック内に定義し、:root には置かない。 モジュール内で --v- 接頭辞の変数を定義しない（--v- は _v.css の :root 専用＝CSS-VAR-002）。

## Nesting

### CSS-NEST-002: 別ファイル定義クラスのネスト上書き禁止

- Class: `A`
- Level: `error`
- Category: `nesting`
- stylelintRule: `fpm/no-cross-file-nesting`

**概要**

ネストによる上書きは「ローカルクラス内で子側主語にする .g- グローバルクラス」と 「同一ファイル内の既存クラス上書き」のみ許可。別ファイルで定義されたクラスをネストで 上書きするのは禁止。

**根拠**

ファイル横断の暗黙上書きを禁じ、CSS-FILE-001 の「定義ファイルが自明」原則を守るため。

**Good**

```text
/* _card.css（同ファイル） */
.card { .card-alt & { … } }
.card { .g-btn.mode-active { … } }
```

**Bad**

```text
/* _card.css */
.g-btn { .special & { … } }  /* .g- をルートに置かない */
.header-nav { … }   /* 別ファイル定義（_header.css）を上書き */
```

**AI/レビューで見る点**

ネスト上書きの対象は、同じファイルの先頭部を持つクラスか、ローカルクラス内で子側主語に する .g- グローバルクラスに限る。.g- の状態変更は .g-btn:hover や .g-btn.mode-active の ように子側の同じ compound に書く。ローカルクラスが主語なら .g- は文脈や pseudo-class の 引数にだけ参照できる。別ファイル由来のクラス（例 _card.css から .header-*）をネストで 上書きしない。

### CSS-NEST-003: ネスト時は親をセレクタ側、子側で親参照して集約

- Class: `A`
- Level: `error`
- Category: `nesting`
- stylelintRule: `fpm/nested-parent-reference`

**概要**

ネスト上書きは「親セレクタの中に子を書く」のではなく、子クラスの定義側で `.parent &` の ように親を参照し、関連スタイルを子の定義箇所に集約する。ネストした規則の主語（末尾の compound）には `&` を含める。非 _g.css のローカルクラス内で子側主語にする .g- は例外。 `&.mode-x`、pseudo-class 等の自己参照は許可する。

**根拠**

子要素に関する定義を1箇所へ集め、探索性を高めるため。

**Good**

```text
.nav-list-item {
  …
  .nav-list & { … }
  .nav-list.mode-alt & { … }
}
.card { .g-btn.mode-active { … } }
```

**Bad**

```text
.nav-list {
  .nav-list-item { … }
  &.mode-alt .nav-list-item { … }
}
```

**AI/レビューで見る点**

ある要素のスタイルは、その要素のクラス定義に集約する。親の中に子定義を書くのではなく、 子側で `.parent &` と親を参照して書く。例外の .g- 子ネストでも状態は .g-btn:hover や .g-btn.mode-active のように同じ compound に置き、さらに `&` をネストしない。主語に `&` が あるかは Stylelint が検査するが、同一クラスの関連スタイルを1箇所に集める配置までは、 生成・レビュー時に自分で守る。

## Responsive

### CSS-RESP-002: @media はクラス内にネストし、ファイル root 直下に書かない

- Class: `A`
- Level: `error`
- Category: `responsive`
- stylelintRule: `fpm/no-root-media`

**概要**

`@media` は対象クラスの規則ブロック内にネストして書く。CSS ファイルの root の直接の子として `@media` を置くのは禁止。root 直下の `@custom-media` は許可する。at-rule ラッパ内の @media、 breakpoint名、raw media feature、同一クラス内の集約位置は検査しない。

**根拠**

レスポンシブ定義を対象クラスに集約し、クラス外に散らばる上書きをなくすため。

**Good**

```text
@custom-media --v-screen-xs (width <= 360px);
.some-class {
  @media (--v-screen-xs) { color: green; }
}
```

**Bad**

```text
@media (--v-screen-xs) {
  .some-class { color: green; }   /* root 直下の @media */
}
```

**AI/レビューで見る点**

@media は対象クラス内にネストし、root 直下に書かない。root 直下には @custom-media 定義を置ける。 breakpointの命名・生値禁止・同一クラス内での集約は CSS-RESP-001 を参照する。

## Prohibited

### CSS-PROHIBIT-002: リセット/例外以外でタグセレクタ禁止

- Class: `A`
- Level: `error`
- Category: `prohibited`
- stylelintRule: `fpm/no-restricted-type-selector`

**概要**

リセットCSSと明示的例外を除き、タグ（型）セレクタでのスタイル指定を禁止。 `.foo ul` や `ul.foo li` のような型セレクタ結合も禁止。例外: マークダウン パーサ出力などクラス付与不能な箇所は、親クラス配下に限りタグ指定可。

**根拠**

型セレクタは影響範囲が広く、上書き事故を招くため。

**Good**

```text
.some-class-list { }
.some-class-list-item { }
```

**Bad**

```text
.some-class ul { }
ul.some-class li { }
```

**AI/レビューで見る点**

要素にはクラスを付けてスタイルする。タグ名（ul, li, a 等）で直接スタイルしない。 リセットや markdown 出力などクラスを付けられない箇所だけ、親クラス配下でタグ指定する。
