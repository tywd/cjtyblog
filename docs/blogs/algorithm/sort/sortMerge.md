## 前言
阅读`《学习JavaScript数据结构与算法（第3版）》`有感\
希望自己每次学习算法都能输出一篇博客，收入专栏，检查自身学习情况~ 文章有错欢迎各路大神指正，别喷，硬要喷的话，麻烦轻点，谢谢大神们~
## 开始
归并排序是第一个可以实际使用的排序算法，冒泡、选择、插入排序性能不好，归并排序性能不错，利用空间来换时间，做到了时间复杂度 `O(n·log(n))` 的同时保持了稳定。

归并排序是一种**分而治之**算法。其思想是将原始数组切分成较小的数组，直到每个小数组只有一个位置，接着将小数组归并成较大的数组，直到最后只有一个排序完毕的大数组。利用空间来换时间，这让它在一些更考虑排序效率和稳定性，次考虑存储空间的场合非常适用（如数据库内排序，和堆排序相比，归并排序的稳定是优点）。并且**归并排序非常适合于链表排序**。
> -   **分而治之**的思想
> -   空间换时间，并且稳定，保持稳定性这一点是它的亮点
> -   二分思想
### 思路
比如数组 `[8,7,6,5,4,3,2,1]`
<!-- <img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d2c7affcbc44ff194f1226ed460601d~tplv-k3u1fbpfcp-watermark.image" width="40%" ></img> -->
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d2c7affcbc44ff194f1226ed460601d~tplv-k3u1fbpfcp-watermark.image?width=40%)
- 分：由上图将两个数组一分为二，不断递归拆分，直到数组长度=1则不再继续拆分
- 归：一边拆分一边进行排序，从最小数组项开始对比左右两个数组项，新建一个空数组，每次比较取出一个相对小的元素放入新数组中。不断递归得出左右两个排列好的数组
- 并：最后将各自的新数组进行合并
### 实现
```js
function mergeSort(array) {
  if (array.length <= 1) return array; // 如果数组长度为1，直接返回。等到merge中排序合并
  var m = Math.floor(array.length / 2);
  var left = mergeSort(array.slice(0, m)); // 不断递归调用最终排列好 left 数组
  var right = mergeSort(array.slice(m, array.length)); // 不断递归调用最终排列好 right 数组
  var arr = merge(left, right); // 合并左右两数组
  return arr;
}
// 排列并合并左右数组
function merge(left, right) {
  var resArr = [], // 新的空数组
    i = 0,
    j = 0
  // 每次比较取出一个相对小的元素放入resArr中
  while (i < left.length && j < right.length) { 
    if (left[i] < right[j]) {
      resArr.push(left[i])
      i++;
    } else {
      resArr.push(right[j])
      j++;
    }
  }
  // 遍历结束后，某个数组可能会有剩余(有可能一个数组所有项都大于另一个数组，则在循环中一直没有被push)，全部追加到结果数组中
  if (i < left.length) {
    resArr.push(...left.slice(i))
  } else {
    resArr.push(...right.slice(j))
  }
  return resArr
}

var arr = [8, 7, 6, 5, 4, 3, 2, 1];
console.log(mergeSort(arr)); // [1, 2, 3, 4, 5, 6, 7, 8]
```
### 优化
- 精简下写法
- 用 `array.splice` 取代 `array.slice`，减少一半的空间消耗。\
  `slice(start,end)`方法可从已有数组中返回选定的元素，**返回一个新数组**，包含从start到end（不包含该元素）的数组元素。\
  `splice()`方法向或者从数组中添加或者删除项目，**返回被删除的项目。（该方法会改变原数组）**
```javascript
function mergeSort(array) {
  if (array.length <= 1) return array; // 如果数组长度为1，直接返回。等到merge中排序合并
  var m = Math.floor(array.length / 2);
  var left = mergeSort(array.slice(0, m)); // 不断递归调用最终排列好 left 数组
  var right = mergeSort(array.slice(m, array.length)); // 不断递归调用最终排列好 right 数组
  return merge(left, right);
}
// 排列并合并左右数组
function merge(left, right) {
  var resArr = [] // 新的空数组
  while (0 < left.length && 0 < right.length) { // 每次比较取出一个相对小的元素放入resArr中
    resArr.push(left[0] <= right[0] ? left.shift() : right.shift()) // array.shift() 取第一个数，并移除该数组中的第一个数
  }
  return resArr.concat(left, right);
}

var arr = [8, 7, 6, 5, 4, 3, 2, 1];
console.log(mergeSort(arr)); // [1, 2, 3, 4, 5, 6, 7, 8]
```
## 复杂度
归并排序需要额外空间，空间复杂度为`O(n)`，不是本地排序，相等元素是不会交换前后顺序，因而是稳定排序。时间复杂度为`O(n·log(n))`，是比较优秀的算法
## 其他
[# 前端算法学习-算法复杂度](https://juejin.cn/post/7034077582584709150)\
[# 前端必会算法（一）：冒泡排序](https://juejin.cn/post/7034765646390886437)\
[# 前端必会算法（二）：选择排序](https://juejin.cn/post/7034819462687621133)\
[# 前端必会算法（三）：插入排序](https://juejin.cn/post/7036181901022855175)
## 最后
**渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正**\
参考
[# 优雅的 JavaScript 排序算法（ES6）](https://juejin.cn/post/6844903582328717325#heading-29)

