---
title: 役割分担
description: Class A/B/Cの責務と、linter・AI・レビューの確認範囲。
sidebar:
  order: 4
  label: 役割分担
---

規約は、機械検査できるものと、人間やAIの設計判断が必要なものに分かれます。

## Class A

Class Aは `stylelint-plugin-fpm` の独自ルールで強制する、FPM固有の最優先項目です。
ファイル名とクラス接頭辞の一致、`.g-` / `.x-` / `.mode-` の扱い、Custom Propertyの定義場所、ネストの親参照方向、root直下 `@media` の配置など、FPM固有の運用ルールが入ります。

AIはClass Aを最初から満たすCSSを生成し、最後にStylelintで確認します。

## Class B

Class Bは既存のStylelint標準ルールで強制する項目です。
例として、クラス名のkebab-case、IDセレクタ禁止、ネスト深度、Custom Property名の形式があります。

Class BもStylelintで検査します。
レビューでは、エラーを回避するための不自然な命名や、ファイル分割の意図とずれた実装がないかを確認します。

## Class C

Class Cは静的検査だけでは判定しにくい助言的ルールです。
`CSS-NAMING-002` の見た目ベース命名禁止、`CSS-PREFIX-003` のJS用ID命名、`CSS-VAR-005` の変数名の語順、`CSS-RESP-001` のブレークポイント設計、`CSS-JS-001` のJSからのスタイル変更方法が該当します。ネスト規則の主語に `&` を置く方向は `CSS-NEST-003`、root直下 `@media` の禁止は `CSS-RESP-002` としてClass Aで機械検査します。

Class CはAI生成時とレビューで担保します。
Stylelintが通っていても、Class Cの観点で読みづらいCSSや変更に弱いCSSは修正対象です。
