---
title: 概要
description: File based Prefix + Modifier style CSS coding conventions + tools
sidebar:
  order: 1
  label: 概要
---

# FPM CSSコーディング規約

FPM は 「File based Prefix + Modifier」 スタイルのCSSコーディング規約です。
class名とそれを書くファイルとの対応ルール＋いくつかの制約により、意図しない上書きなどCSS開発で発生しがちな問題を避け、長期的にメンテナンスしやすいCSSを実現します。

## 基本コンセプト

class名の接頭辞とファイル名を一致させます。
例えば `_header.css` には `.header` と `.header-*` を置き、別モジュールのクラスを混ぜません。
この制約により、どのclassがどのファイルに書かれているかが明確になると同時に、重複定義、暗黙の上書きを避けることができます。
加えて、ネストに関するルールと併用することにより、詳細度による意図せぬ上書きも避ける事ができます。

## 全体像

FPMにはClassA/B/Cの3分類のルールがあります。

- ClassA: FPM固有の最優先ルール。Stylelintの独自ルールで強制されます。
- ClassB: Stylelint標準ルールで強制されるルールです。
- ClassC: 機械的に判定することが難しい助言的ルールです。

重要度の高いClass A/BのルールはStylelintで機械的に検査することができます。
Class Cのルールは機械的に判断できないため、AIによる生成/レビューで担保されます。

## 規約を読む順番

1. まず [はじめに](./getting-started/) で導入方法を確認する。
2. [役割分担](./roles/) でlinterとAI/レビューの責務を把握する。
3. [規約リファレンス](./reference/rules/) で全22ルールの詳細を見る。
