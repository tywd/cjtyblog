## 前言
阅读`《学习JavaScript数据结构与算法（第3版）》`有感\
希望自己每次学习算法都能输出一篇博客，收入专栏，检查自身学习情况~ 文章有错欢迎各路大神指正，别喷，硬要喷的话，麻烦轻点，谢谢大神们~
## 开始
桶排序（也被称为箱排序）也是分布式排序算法，它将元素分为不同的桶（较小的数组），再使用一个简单的排序算法，例如插入排序（用来排序小数组的不错的算法），来对每个桶进行排序。然后，它将所有的桶合并为结果数组。

### 思路
比如数组 `[3, 8, 6, 1, 5, 7, 9, 2, 4]`
- 分：创建桶并将元素分布到不同的桶中，桶排序的一个重要步骤是计算每个桶中需要分布的元素个数
- 排：将分好的桶中的各个元素进行[# 插入排序](https://juejin.cn/post/7036181901022855175)
- 并：最后合并各个桶的数据，完成排序
具体看以下代码解释
### 实现
```javascript
function bucketSort(array, bucketSize = 5) {
  if (array.length <= 1) return array;
  var buckets = createBuckets(array, bucketSize) // 创建桶并将元素分布到不同的桶中
  return sortBuckets(buckets);
}

// 创建桶并将元素分布到不同的桶中
function createBuckets(array, bucketSize) { // bucketSize表示每个桶的容量
  var maxValue = Math.max(...array); // ES6的骚操作
  var minValue = Math.min(...array); // ES6的骚操作

  var bucketCount = Math.ceil((maxValue - minValue) / bucketSize) // 桶排序的第一个重要步骤是计算每个桶中需要分布的元素个数
  var buckets = [];
  for (let i = 0; i < bucketCount; i++) {
    buckets[i] = []; // 将每个桶置空初始化
  }
  for (var i = 0; i < array.length; i++) {
    var bucketIndex = Math.floor((array[i] - minValue) / bucketSize); // 计算要将元素放到哪个桶中
    buckets[bucketIndex].push(array[i]); // 将元素存入各个桶中
  }
  return buckets
}
// 将每个桶进行排序
function sortBuckets(buckets) {
  var sortedArray = [];
  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i] != null) {
      sortedArray.push(...insertionSort2(buckets[i]));
    }
  }
  return sortedArray;
}

// 插入排序
function insertionSort2(array) {
  if (array.length <= 1) return array; // 如果数组长度为1，直接返回
  var sum = 0 // 用来记录循环了多少次
  for (var i = 1; i < array.length; i++) {
    var j = i; // 以索引1为例子
    var temp = array[j]; // 存储一个需要比较的值，开始向前比较
    // 1.若temp < arr[j-1]，则arr[j-1]后移(即令arr[j] = arr[j-1]);
    // 2.继续比较 arr[j-2] 与 temp，若temp < arr[j-2]，则arr[j-2]后移(令arr[j-1] = arr[j-2])，
    //   若temp>arr[j-2]，则arr[j-1] = temp
    while (j > 0 && array[j - 1] > temp) {
      sum++
      array[j] = array[j - 1]; // 这里可看成是将 j-1 了后移一位
      j--;
    }
    array[j] = temp;
  }
  console.log('sum: ', sum); // 6
  return array;
}

var arr = [3, 8, 6, 1, 5, 7, 9, 2, 4];
console.log(bucketSort(arr));
```
### 优化
暂无其他优化想法，欢迎各路大神评论
## 复杂度

| 排序算法 | 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 | 排序方式 | 稳定性
| --- | --- | --- | --- | --- | --- | --- |
| 桶排序 | O(n+k) | O(n+k) | 视情况而定 | O(n+k) | Out-place | 稳定 |

- 时间复杂度
数据经过桶的划分之后，有些桶里的数据非常多，有些非常少，很不平均，那桶内数据排序的时间复杂度就不是常量级了，是线性级`O(n)`，可以简单理解：桶的范围大小是人为指定的，它不随数据规模变化，如果数据相对均匀分布，那么桶的个数就是核心影响因子了。
- 空间复杂度
1) 桶排序是分布式排序，适合处理大批量数据。需要额外空间，是外部排序。桶排序是否稳定，取决于第二步排序算法的选择。数据规模为n，划分到k个桶中，总空间复杂度`O(n + k)`

2) 桶排序对待排序数据的要求是非常苛刻的，适用场景是在数据分布相对比较均匀或者数据跨度范围并不是很大时。如果数据跨度非常大，空间消耗就会很大，如果数据都被划分到一个桶里，桶排序就退化为`O(nlogn)`的排序算法，所以桶排序很少使用。
## 其他
[# 前端算法学习-算法复杂度](https://juejin.cn/post/7034077582584709150)\
[# 前端必会算法（一）：冒泡排序](https://juejin.cn/post/7034765646390886437)\
[# 前端必会算法（二）：选择排序](https://juejin.cn/post/7034819462687621133)\
[# 前端必会算法（三）：插入排序](https://juejin.cn/post/7036181901022855175)\
[# 前端必会算法（四）：归并排序](https://juejin.cn/post/7036277115905540103)\
[# 前端必会算法（五）：快速排序](https://juejin.cn/post/7037137749387771940)\
[# 前端必会算法（六）：希尔排序](https://juejin.cn/post/7037775453041459208)\
[# 前端必会算法（七）：计数排序](https://juejin.cn/post/7038521599342936071)
## 最后
**渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正**
### 参考
[# 写算法并记住它：桶排序](https://juejin.cn/post/6844903945312305160)