## 前言
阅读`《学习JavaScript数据结构与算法（第3版）》`有感\
希望自己每次学习算法都能输出一篇博客，收入专栏，检查自身学习情况~ 文章有错欢迎各路大神指正，别喷，硬要喷的话，麻烦轻点，谢谢大神们~
## 开始
**基数排序**也是一个分布式排序算法，它根据数字的有效位或基数（这也是它为什么叫基数排序）将**整数**分布到桶中。基数是基于数组中值的记数制的。

### 思路
比如数组 `[3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48]`\
- 如下先排个位，最后得出`[50,2,3,44,4,5,15,36,26,46,47,27,38,48,19]`
![710E62DF-9043-4FE5-849B-2BBFBB95DC31.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c660b339ff7409ca885ee5f9b5d1a5e~tplv-k3u1fbpfcp-watermark.image?)
- 再排十位，最后得出`[2,3,4,5,15,19,26,27,36,38,44,46,47,48,50]`
![B820AB2B-D9B0-4ECF-85C5-C15DACBD656A.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b129f6e6ff234d4f8e8be00937130b5b~tplv-k3u1fbpfcp-watermark.image?)
- 以此类推，排序百位，千位....

具体看以下代码解释
### 实现
```javascript
// 找出数组内最大值的方法
function findMaxValue(array) {
  var max = array[0];
  for (var i = 0; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i]
    }
  }
  return max
}

function radixSort(array) {
  var count = findMaxValue(array).toString().length; // 找出最大值算出是多少位的，则循环多少次
  var bucket = []; // 10个桶的容器
  var significantDigit = 1; // 用于取位数
  while (count > 0) {
    for (var i = 0; i < 10; i++) { // 由于每一位数的数值范围都是从0到9，需要构建10个桶
      bucket[i] = []; // 初始化10个桶
    }
    for (var i = 0; i < array.length; i++) {
      var digit = Math.floor((array[i] / significantDigit) % 10) // 得出位数的值对应的桶的索引
      bucket[digit].push(array[i]) // 将算出的位置归入各个桶里
    }
    significantDigit *= 10
    array.length = 0;
    for (var i = 0; i < bucket.length; i++) {
      array = array.concat(bucket[i]) // 将排序后的各个桶合并
    }
    count--; // 重复该过程去找十位、百位、千位... 的数进行排列，循环次数，用于跳出循环
  }
  return array
}
var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48]
console.log(radixSort(arr))
```
### 优化
暂无好的优化，希望广大掘友多多挖掘
## 复杂度
| 排序算法 | 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 | 排序方式 | 稳定性
| --- | --- | --- | --- | --- | --- | --- |
| 基数排序 | O(n*k) | O(n*k) | O(n*k) | O(n+k) | Out-place | 稳定 |

- 时间复杂度
基数排序的性能，取决于内部排序算法的选择。如果使用桶排序，时间复杂度为`O(n*k)`，其中k为最大元素的位数，一般都是很小数。
- 空间复杂度
`O(n+k)`

## 其他
[# 前端算法学习-算法复杂度](https://juejin.cn/post/7034077582584709150)\
[# 前端必会算法（一）：冒泡排序](https://juejin.cn/post/7034765646390886437)\
[# 前端必会算法（二）：选择排序](https://juejin.cn/post/7034819462687621133)\
[# 前端必会算法（三）：插入排序](https://juejin.cn/post/7036181901022855175)\
[# 前端必会算法（四）：归并排序](https://juejin.cn/post/7036277115905540103)\
[# 前端必会算法（五）：快速排序](https://juejin.cn/post/7037137749387771940)\
[# 前端必会算法（六）：希尔排序](https://juejin.cn/post/7037775453041459208)\
[# 前端必会算法（七）：计数排序](https://juejin.cn/post/7038521599342936071)\
[# 前端必会算法（八）：桶排序](https://juejin.cn/post/7038608760176115749)
## 最后
**渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正**
### 参考
[# 写算法并记住它：基数排序](https://juejin.cn/post/6844903950978662414)\
[# 十大经典排序算法——基数排序](https://juejin.cn/post/6913918524784115719)
