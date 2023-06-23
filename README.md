# Fanchor
Execute function when targer element(s) appers in window

指定した要素が画面内に表示された際に、任意の関数を実行するモジュールです。

## Getting Started

```javascript
  <script src="./fanchor.js"></script>
  <script>
    const obj = Fanchor({
      // 表示起点の対象になる要素をセレクタで指定する。
      anchorSelector: '.topic',
      // そのセレクタの対象要素が画面内に表示された際に実行する関数を設定する。
      func: (target) => {
        target.classList.remove('hidden');
      },
    });
    // 監視を一時的に止めることが可能
    obj.stop();
    // 監視を再開することも可能
    obj.restart();
    // 完全に機能を停止する
    obj.destroy();
  </script>
```

## Options

オプションパラメータ：
```javascript

Fanchor({
  anchorSelector: required,
  func: required, // (anchorSelectorTarget) => { ... }
  anchorPoint: "top",
  gap: 0,
  fireOnce: true,
});

```

|オプション名|型|必須|説明|デフォルト値|
| ---- | ---- | ---- | ---- | ---- |
|anchorSelector| string | required | 判定対象の要素をセレクタで指定する。||
|func| Function | required | 判定対象が画面に表示された際に実行される関数を指定する。この関数は引数を1つ取る。引数の中身は判定対象のNode。||
|anchorPoint|string|no|画面表示された対象の上端か下端どちらが表示されたら処理を実行するか選択する。"top"で上端、"bottom"で下端が判定対象になる。|"top"|
|gap|number|no|判定するポイントをanchorPointで指定した辺からどのくらいずらすかを設定する。単位はpxで、正の値を入力すると判定座標が下側へずれ、負の値を入力すると判定座標が上側へずれる。0で上端、下端と同じ座標となる。|0|
|fireOnce|bool|no|指定の要素で一度関数が実行されたら再び条件を満たしても再度実行されないようにする。要素ごとに制御する。trueで一度だけ実行。falseで条件を満たすと何度でも実行する。|true|

## チュートリアル
### 簡単な実装例1

[実際の表示はこちら：tutorial01.html](https://haruyan-hopemucci.github.io/my-portfolio/lib-samples/auto-load-anchor/tutorial01.html)

以下の様にhtmlコードを記載します。
```html
  <div style="height: 150vh; background-color: burlywood;">
    <p>150vh高さの領域</p>
  </div>
  <div class="anchor" style="height:50vh; background-color: tomato; color: white">
    この領域が表示されたら関数が実行されます。
  </div>
```
続けて、scriptを記載します。
```html
  <script src="./fanchor.js"></script>
  <script>
    Fanchor(
      {
        anchorSelector: '.anchor',
        func: () => {
          alert('ターゲットが表示されました！');
        }
      }
    );
  </script>
```
`anchorSelector` に `'.anchor'` を指定すると、`"anchor"`クラスを指定した要素が画面内に表示されたら `func` で宣言した関数が実行されます。
このサンプルの場合、 `anchor`クラスを付与したdiv要素が画面内に表示されたらalertダイアログが表示されます。

### 簡単な実装例2

[実際の表示はこちら：tutorial02.html](https://haruyan-hopemucci.github.io/my-portfolio/lib-samples/auto-load-anchor/tutorial02.html)

対象要素をフェードインさせる処理を作成してみます。
htmlを次の様に記載してください。

```html
  <div style="height: 150vh; background-color: burlywood;">
    150vh高さの領域
  </div>
  <div style="height:50vh; background-color: tomato; color: white">
    <p>写真の領域が表示されたら関数が実行されます。</p>
    <p>写真がフェードインします。</p>
    <img class="anchor" src="./panda.jpg">
  </div>
```
スクリプトを以下の様に記載します。
```html
  <script src="./fanchor.js"></script>
  <script>
    Fanchor(
      {
        anchorSelector: '.anchor',
        func: (target) => {
          target.classList.add('active');
        }
      }
    );
  </script>
```
cssを以下の様に定義してください。
```css
    .anchor{
      opacity: 0;
      transition: all 1s ease;
    }
    .active{
      opacity: 1;
    }
```
`anchor`クラスを設定したimg要素は、初期状態では透明です。 `active`クラスを付与されると`opacity`が1になり画面に表示されます。ただし、`transition`が設定されており`opacity`の表示切り替わりは1秒間のアニメーションとなります。

スクロールしてimg要素が画面に表示されると、img要素がフェードインします。

### 複数のアニメーションを組み合わせる例

[実際の表示はこちら：tutorial03.html](https://haruyan-hopemucci.github.io/my-portfolio/lib-samples/auto-load-anchor/tutorial03.html)

複数のアニメーションを組み合わせ、複雑な表示にも対応できます。

html部分
```html
  <div style="height: 150vh; background-color: burlywood;">
    150vh高さの領域
  </div>
  <div class="anchor" style="height:50vh; background-color: tomato; color: white">
    <p>この領域の一番下が表示されたら関数が実行されます。</p>
    <h2 class="fade-in-right">右からくるぞ！</h2>
    <h2 class="fade-in-left">左からくるぞ！</h2>
    <h2 class="fade-in-bottom">下からくるぞ！</h2>
  </div>
```

スクリプト部分
```html
  <script src="./fanchor.js"></script>
  <script>
    Fanchor(
      {
        anchorSelector: '.anchor',
        anchorPoint: "bottom",  // 表示対象ポイントを下端に設定
        func: (target) => {
          // 対象要素内のh2タグそれぞれに対し、'active'クラスを付与。
          target.querySelectorAll('h2').forEach( (elem) =>{
            elem.classList.add('active');
          });
        }
      }
    );
  </script>
```

CSS部分
```css
    .anchor{
      /* 各要素をtranslateでずらす際に横幅がデバイス幅を超過するの防ぐためoverflowを設定 */
      overflow: hidden;
    }
    /* 各h2要素共通設定 */
    h2{
      transition: all 1s ease;
      text-align: center;
    }
    /* 各要素の初期位置 */
    h2.fade-in-right{
      /* アニメーション実行時に遅延をつける */
      transition-delay: 0s;
      /* 透明に設定 */
      opacity: 0;
      /* translateを使って右側へずらしておく */
      transform: translateX(100px);
    }
    /* 以下、同様に設定。*/
    h2.fade-in-left{
      transition-delay: 500ms;
      opacity: 0;
      transform: translateX(-100px);
    }
    h2.fade-in-bottom{
      transition-delay: 1000ms;
      opacity: 0;
      transform: translateY(100px);
    }
    /* active時の表示設定 */
    h2.fade-in-right.active {
      /* 透明度を戻す */
      opacity: 1;
      /* 表示位置も戻す */
      transform: translateX(0);
    }
    /* 以下、同様に設定。*/
    h2.fade-in-left.active{
      opacity: 1;
      transform: translateX(0);
    }
    h2.fade-in-bottom.active{
      opacity: 1;
      transform: translateY(0);
    }
```

このサンプルでは、対象表示要素の下端が表示された時点で関数が実行されます。
関数内では、対象要素の中にあるh2要素を `querySelectorAll`で抽出し、それぞれに `active` クラスを設定しています。

アニメーション対象のh2要素は、予め `opacity:0` で透明にし、`translate` を用いて表示位置を左右下にずらしています。また、それぞれ `transition-delay` で異なる値を設定し、アニメーション開始時間をずらしています。
`acttive`クラスが付与されると、 `opacity:1` と `translate` が0になり、透明から不透明になりつつ要素がずらした位置から元の位置に戻ってきます。

### 無限スクロールの実装例

[無限ロードスクロールのサンプル](https://haruyan-hopemucci.github.io/my-portfolio/parts-auto-load-anchor.html) 参照