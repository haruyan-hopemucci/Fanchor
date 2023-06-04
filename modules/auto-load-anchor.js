/**
 * auto-load-anchor.js
 * 
 * by haruyan-hopemucci
 * 
 * create: 2020.10.14
 * 
 * changelog:(above is newer)
 *  v0.2.0 2023.06.04  : IntersectingObserver API に書き換え
 *  v0.1.3 2020.11.23  : 実行済み判定の不具合修正
 *  v0.1.3 2020.11.11  : クラス形式から関数形式へ変更。fireOnce追加。
 *  v0.1.2 2020.10.30  : add setting param: gap, anchorPoint.
 *  v0.1.1 2020.10.15  : add 1 argment of func when called.
 *  v0.1.0 2020.10.14  : Creation.
 * 
 * MIT License.
 */

function AutoLoadAnchor(settings) {
  /** gapオプションからobserverのthresholdオプションへのマッピング */
  const __anchorToThreshold = { "top": 0.0, "bottom": 1.0 };
  const __gapVectorToThreshold = { "top": 1, "bottom": -1 };

  const observe = (props) => {
    // TODO: 監視解除時の処理は変更する必要がある
    if (props.terminated != 0) {
      return;
    }
    // Observerの準備
    const gapValue = __gapVectorToThreshold[props.anchorPoint] * props.gap;
    const thresholdValue = __anchorToThreshold[props.anchorPoint];
    const options = {
      root: null,
      threshold: thresholdValue,
      rootMargin: `0px 0px ${gapValue}px 0px`
    };
    props.__observer = new IntersectionObserver((entries) => {
      if (terminated) {
        return;
      }
      entries.forEach(e => {
        if (e.isIntersecting) {
          props.func(e.target);
        }
      });
    }, options);

    // セレクタで指定される全ての要素に対して判定するように変更
    let targets = document.querySelectorAll(props.anchorSelector);
    for (let target of targets) {
      props.__observer.observe(target);
    }
  };

  // プロパティ初期化：省略されたパラメータをデフォルトに設定しなおす
  const props = {
    anchorSelector: settings.anchorSelector,
    func: settings.func,
    semaphore: 0,
    terminated: false,
    runImmediate: settings.runImmediate !== undefined ? settings.runImmediate : true,
    gap: settings.gap ? settings.gap : 0,
    anchorPoint: settings.anchorPoint ? settings.anchorPoint : "top",  // "top" or "bottom"
    fireOnce: settings.fireOnce !== undefined ? settings.fireOnce : true,
    observe: null,
  };

  observe(props);

  return {
    props: props,
    stop: () => props.terminated = true,
    restart: () => props.terminated = false,
  };

}
