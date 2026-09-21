---
title: Class B 規約
description: FPM CSS Coding Conventions の Class B 規約（Stylelint標準の機械強制ルール）です。
sidebar:
  label: Class B 規約
---

<!-- GENERATED — DO NOT EDIT -->

Version: `1.2.0` / Rules: 5 (Class B; all rules: A12 / B5 / C5)

既存のStylelint標準ルールで機械強制する。

[規約リファレンスに戻る](../)

## Naming

### CSS-NAMING-001: クラス名は全小文字・ハイフン区切り（kebab-case）

- Class: `B`
- Level: `error`
- Category: `naming`
- stylelintRule: `selector-class-pattern`

**概要**

クラス名は kebab-case で書く。snake_case・camelCase・大文字始まりは禁止。 接頭辞部分に限り特殊事情（Angular等）で camelCase を許容。

**根拠**

記法を1つに固定し、命名で「迷う・考える」コストを排除するため。

**Good**

```text
.good-class-definition { }
```

**Bad**

```text
.snakecase_class {}
.camelCaseClass {}
.Has-Capital-CLASS {}
```

**AI/レビューで見る点**

新規クラスは全小文字ハイフン区切りで命名する。アンダースコアや大文字を使わない。 `.g-` / `.x-` / `.mode-` 接頭辞クラスもこの kebab-case 形式に従う。

## Variables

### CSS-VAR-001: Custom Property 名はケバブケース

- Class: `B`
- Level: `error`
- Category: `variables`
- stylelintRule: `custom-property-pattern`

**概要**

CSS変数（Custom Property）名は全小文字ハイフン区切り。snake_case・camelCase 禁止。

**根拠**

命名記法をクラスと揃え、揺れをなくすため。

**Good**

```text
--base-margin: 12px;
--base-padding: 12px;
```

**Bad**

```text
--base_margin: 12px;
--basePadding: 12px;
```

**AI/レビューで見る点**

Custom Property 名は kebab-case で書く（--base-margin）。--v- 接頭辞もこの形式に従う。

## Nesting

### CSS-NEST-001: ネスト原則禁止・許可時も1階層まで

- Class: `B`
- Level: `error`
- Category: `nesting`
- stylelintRule: `max-nesting-depth`

**概要**

セレクタのネストは基本禁止。必要な場合に限り1階層のみ許可。多段（.a .b .c）や 多子ネストは禁止。

**根拠**

詳細度と可読性を保ち、定義の追跡を容易にするため。

**Good**

```text
.my-child {
  .my-parent-alternate & { … }
}
```

**Bad**

```text
.my-parent .my-child .my-element { … }
.my-parent { .my-child {} .my-child2 {} }
```

**AI/レビューで見る点**

ネストは原則使わない。使う場合も1階層まで。多段結合子や多子ネストを書かない。

## Prohibited

### CSS-PROHIBIT-001: IDセレクタでのスタイル指定禁止

- Class: `B`
- Level: `error`
- Category: `prohibited`
- stylelintRule: `selector-max-id`

**概要**

#id によるスタイル指定を禁止。クラスで表現する。

**根拠**

詳細度の暴走を避け、上書き事故を防ぐため。

**Good**

```text
.main { }
.main-list { }
```

**Bad**

```text
#main { }
#main ul { }
```

**AI/レビューで見る点**

スタイル指定は必ずクラスで行う。ID セレクタ（#foo）をスタイルに使わない。

### CSS-PROHIBIT-003: @layer / @scope は基本使用禁止

- Class: `B`
- Level: `error`
- Category: `prohibited`
- stylelintRule: `at-rule-disallowed-list`

**概要**

@layer・@scope を原則禁止（規約遵守なら不要。外部ライブラリ前提時のみ例外）。

**根拠**

規約の詳細度・分割方針で不要になるため、覚えることを減らす。

**Good**

```text
/* @layer / @scope は使用しない */
```

**Bad**

```text
@layer base { … }
@scope (.card) { … }
```

**AI/レビューで見る点**

@layer / @scope を書かない。詳細度は規約のファイル分割・命名で管理する。
