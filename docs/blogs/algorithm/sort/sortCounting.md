## 前言
阅读`《学习JavaScript数据结构与算法（第3版）》`有感\
希望自己每次学习算法都能输出一篇博客，收入专栏，检查自身学习情况~ 文章有错欢迎各路大神指正，别喷，硬要喷的话，麻烦轻点，谢谢大神们~
## 开始
计数排序是一个非基于比较的排序算法，是一个分布式排序，分布式排序是使用已经组织好的辅助数据结构（称为 “桶”），来得到排好序的数组。\
它用来排序整数的优秀算法（它是一个**整数排序算法**），是**对一定范围内的整数排序**，时间复杂度为O(n+k)，其中k是临时计数数组的大小；但它确实需要更多的内存来存放临时数组，是一种**牺牲空间换取时间**的做法。
它的复杂度为Ο(n+k)（其中k是整数的范围），快于任何比较排序算法。且当O(k)>O(n*log(n))的时候其效率反而不如基于比较的排序（基于比较的排序的时间复杂度在理论上的下限是O(n*log(n)), 如归并排序，堆排序）

### 思路
比如数组 `[0, 1, 1, 3, 5, 5, 7, 8]`
-  我们进行**计数数组的下标**与**原数组的值**进行关联。计数数组下标是 0，则其对应了原数组中的数组值 0。计数数组下标的最大值就对应了原数组中的数值的最大值。

-  找出原数组中的最大值 n，然后创建长度为 n+1 的计数数组。（即数组下标范围：0 ~ n），那么数组的长度就是 n+1，则计数数组长度为 8 + 1 = 9。

-  进行计数数组的生成，统计原数组中的值出现的个数。

-  计数数组生成完了就能还原出排好序的数组。计数数组的下标记录的是原数组中出现的值，计数数组的值记录的是这个原数组中的值出现的次数，比如计数数组为 [3, 4, 1]，那么它恢复出的排好序的数组就是 [0, 0, 0, 1, 1, 1, 1, 2]。
具体看以下代码解释
### 实现
```javascript
function countingSort(array) {
  if (array.length <= 1) return array;
  var maxValue = findMaxValue(array); // 找出原数组中的最大值 N，然后创建长度为 N+1 的计数数组，因为要访问array[N]，数组长度起码为N+1
  // var maxValue = Math.max(...array); // ES6的骚操作
  var counts = new Array(maxValue + 1); // 用于计数的数组
  // 遍历原数组，将元素计数存入计数数组
  array.forEach(element => {
    if (!counts[element]) counts[element] = 0 // 没有值时，令该值数量为0
    counts[element]++; // 令该索引的值数量 +1
  });

  let sortIndex = 0; // 辅助索引
  // 开始排序数组，由于是最大值有多大，索引就有多大，所以对应的 i 即为原数组array对应的值，
  // 有多个相等的值count时直接在whlie循环继续递增的 array[sortIndex] 中赋值
  counts.forEach((count, i) => {
    while(count > 0){
      array[sortIndex++] = i; //
      count--; // 原数组元素的数量 -- 为 0时，跳出while 继续forEach
    }
  })
  return array;
}

// 找出数组内最大值的方法
function findMaxValue(array) {
  var max = array[0];
  for (let i = 0; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i]
    }
  }
  return max
}

var arr = [1, 0, 5, 1, 3, 8, 5, 7]
console.log(countingSort(arr)) //  [0, 1, 1, 3, 5, 5, 7, 8]
```
结果
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0655b902fcbb46aa8d952637512da504~tplv-k3u1fbpfcp-watermark.image?)
### 优化
上面的代码是存在一点问题的
1.  若数组有负整数
2.  若数组中的最大值为 999，数组中的值在 990 ~ 999 这个区间内，那若仍创建长度为 1000 的数组，那得浪费多少空间啊
解决方法就是将最小值 **min** 也找出来，然后赋值给数组的下标 0 不再对应原数组中的值 0，直接`counts[0] = 990`，计数数组长度则变为 **max - min + 1**
```javascript
function countingSort2(array) {
  // 找出原数组中的最大值 与最小值
  var maxValue = Math.max(...array); // ES6的骚操作
  var minValue = Math.min(...array);
  var counts = new Array(maxValue - minValue + 1); // 创建计数数组

  // 生成计数数组
  array.forEach((element,i) => {
    // 关联关系为：index + minValue = value
    var index = array[i] - minValue;
    if (!counts[index]) counts[index] = 0;
    counts[index]++;
  })

  // 从计数数组中恢复出排好序的数组
  var sortedIndex = 0;
  counts.forEach((count, i) => {
    while (count > 0) {
      array[sortedIndex++] = i + minValue; // 关联关系为：i + minValue = value
      count--;
    }
  })
  return array;
}
var arr2 = [1, -1, -2, 1, 0, 0, 3, 1, 3, 5, 2]
console.log(countingSort2(arr2)) // [-2, -1, 0, 0, 1, 1, 1, 2, 3, 3, 5]
```
## 复杂度

| 排序算法 | 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 | 排序方式 | 稳定性
| --- | --- | --- | --- | --- | --- | --- |
| 基数排序 | O(n+k) | O(n+k) | O(n+k) | O(k) | Out-place | 稳定 |
- 时间复杂度
计数排序适合整数排序，时间复杂度为O(n+k)。简单说明一下为啥是O(n+k)。这里使用了两层循环，外层由counts的length——待排数组最值之差（记为k）——决定的，而while循环次数是count决定的，而所有count之和正好为array的length（记为n）
- 空间复杂度
代码里的实现的空间复杂度为O(k)。可见当k特别大时，将会使用很多空间。
## 其他
[# 前端算法学习-算法复杂度](https://juejin.cn/post/7034077582584709150)\
[# 前端必会算法（一）：冒泡排序](https://juejin.cn/post/7034765646390886437)\
[# 前端必会算法（二）：选择排序](https://juejin.cn/post/7034819462687621133)\
[# 前端必会算法（三）：插入排序](https://juejin.cn/post/7036181901022855175)\
[# 前端必会算法（四）：归并排序](https://juejin.cn/post/7036277115905540103)\
[# 前端必会算法（五）：快速排序](https://juejin.cn/post/7037137749387771940)\
[# 前端必会算法（六）：希尔排序](https://juejin.cn/post/7037775453041459208)
## 最后
**渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正**
### 参考
[# 写算法并记住它：计数排序](https://juejin.cn/post/6844903942464208909)\
[# 图解排序算法——计数排序（javascript）](https://juejin.cn/post/6879683535741911047)