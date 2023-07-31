# 手写-防抖与节流
![4e56aed8047b18489beb757ccf626813.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/401450812d6044e6b3999a76c38d098d~tplv-k3u1fbpfcp-watermark.image)
## 前言
函数防抖与节流在许多大厂(比如阿里、字节)面试题中经常有出现，跟随大厂的脚步，在此做一个记录学习备用
## 正文
### 防抖(debounce)
字面意思，防止抖动嘛~ 不要让ta随意乱抖，太夸张的动作，物极必反，影响性能。
`定义： 任务频繁触发的情况下，只有任务触发的间隔超过指定间隔的时候，任务才会执行。就是在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。`

举个🌰 ： 比如一个input 搜索框的模糊搜索，每次输入完要请求一次接口，这无疑会对服务器造成压力，所以这里防抖就可以设置比如在2秒内如果没有重新继续输入的话，就请求一次接口，而不是一输完立马发起请求。

### 节流(throttle)
字面意思，节约流量？ 过分的请求操作，肯定对服务器有压力，流量损耗，所以要操作节约流量，故名节流咯？

`定义：指定时间间隔内只会执行一次任务。就是规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。`

举个🌰 ： 比如一个页面很长，而现在需要监听滚动事件判断是否到页面底部自动加载更多，那如果单纯用防抖，就会一直在等待到停止滚动才有回去加载更多，那用户就需要在最后停止滚动的时候进行等待，体验不是很好，这时候如果如果是 throttle 的话，只要页面滚动就会间隔一段时间判断一次，体验会更好

### 实现
1. 函数防抖(debounce)
以高程三中的防抖为例
```js
// 在窗口内滚动一次，停止，1000ms 后，打印了 hello world，因为我们设置了一个 1000ms 延迟的定时器，如果在 1000ms内不停止的不断滚动，则一直不会触发
function throttle(method, context) { // 高程三这里显然是命名错了，这应该是防抖才对 debounce，网上也有很多在纠正这个错误的
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
    method.call(context);
    }, 1000);
}

function print() {
    console.log('hello world');
}

window.onscroll = function() {
    throttle(print);
};
```
我的使用场景是防止用户多次点击提交去请求接口，针对我的应用场景我的点击方法还有需要传参改写如下
```js
const debounce = (fn, delay) => {
    let timer = null;
    return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        fn.apply(this, args);  // 也可用 fn.call(this, ...args) 这里关于apply 与 call还有一个bind的区别，请关注下篇文章
    }, delay);
    }
}
```
2. 函数节流(throttle)
```js
const throttle = (fn, delay) => {
    let last = 0;
    return function (...args) {
    if (Date.now() - last > delay) {
        last = Date.now()
        setTimeout(() => {
        fn.apply(this, args);
        }, delay);
    }
    }
}
```
### 相同点与不同点
  #### 相同点
    `函数节流（throttle）与 函数防抖（debounce）核心都是为了限制函数的执行频次，以达到优化函数触发频率过高导致的响应速度跟不上触发频率，出现延迟，假死或卡顿现象的目标。`
  #### 不同点
    `函数防抖（debounce）是触发n秒后再执行回调，如果n秒内一直被触发，则会一直再等n秒才会执行回调。`
    `函数节流（throttle）是无论你触发多少次，都会固定n秒去请求一次，如果不触发则不请求 防抖和节流的区别在于以第一次为准还是最后一次为准。`
### 其他使用场景举例
#### debounce 应用场景 (哪些时候对于连续的事件响应我们只需要执行一次回调？) 
> - 每次 resize/scroll 触发统计事件
> - 文本输入的验证（连续输入文字后发送 AJAX 请求，只在用户停止键入时发送）

#### throttle 应用场景 (哪些时候我们需要间隔一定时间触发回调来控制函数调用频率？)
> - DOM 元素的拖拽功能实现（mousemove）
> - 计算鼠标移动的距离（mousemove）
> - 监听滚动事件判断是否到页面底部自动加载更多：给 scroll 加了 debounce 后，只有用户停止滚动后，才会判断是否到了页面底部；如果是 throttle 的话，只要页面滚动就会间隔一段时间判断一次

## 小结
> 函数节流和函数去抖的核心其实就是限制方法被频繁触发，大多数情况下因为 DOM 事件的监听回调，所以方法会被频繁触发，因此才出现了防抖(debounce)和节流(throttle)。
## 扩展
    以上是小人拙见，如果对您有帮助，请点赞收藏备用哈哈哈(～￣▽￣)～，如有错误，请广大掘友指正，如果要喷，请喷轻点(￣.￣)，感谢各位大刁~
    - [函数去抖的实现](https://github.com/lessfish/underscore-analysis/issues/21)
    - [函数节流与函数防抖](https://segmentfault.com/a/1190000008768202)
    - [轻松理解JS函数节流和函数防抖](https://juejin.cn/post/6844903535125987335#heading-12)
    - [7分钟理解JS的节流、防抖及使用场景](https://juejin.cn/post/6844903669389885453#heading-8)
    - [# 高频：手写一个防抖函数 debounce](https://mp.weixin.qq.com/s/vIeIBeygpYtFHlg4oLCR0g)
