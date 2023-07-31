## 前言
阅读`《学习JavaScript数据结构与算法（第3版）》`有感\
希望自己每次学习算法都能输出一篇博客，收入专栏，检查自身学习情况~ 文章有错欢迎各路大神指正，别喷，硬要喷的话，麻烦轻点，谢谢大神们~
> ps: 这书`《学习JavaScript数据结构与算法（第3版）》`也没有讲堆排序
## 开始
堆排序可以认为是*选择排序的改进版*，像[选择排序](https://juejin.cn/post/7034819462687621133)一样*将输入划分为已排序和待排序*

什么是堆，堆是满足下几点的完全二叉树([什么是二叉树？](https://juejin.cn/post/6993519369858842661#heading-1))
- 每个节点的值都大于等于（或者小于等于）其左右子节点的值
    - 每个结点的值都大于或等于其左右子结点的值，称为大顶堆；
    - 或每个结点的值都小于或等于其左右子结点的值，称为小顶堆。
- 除了最后一层，其他层的节点个数都是满的，最后一层的节点都靠左排列
- 堆可以用一个数组表示，给定最后一个非叶子节点的下标 `i` （i假设为2）令初始索引为 `i = Math.floor(array.length / 2) - 1` ，那么左子节点为 `A[2i+1]` ，右子节点为 `A[2i+2]`
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecdc051f3d3d4d6bb8338ee4276fc477~tplv-k3u1fbpfcp-watermark.image?)
### 思路
- 创建一个堆 H[0,1,2, ...., n-1]；
- 以大顶堆为例把堆顶元素（最大值）（第一个有效序列）与最后一个子元素（最后一个有效序列）交换，有效序列长度减1
- 堆化有效序列，使有效序列重新形成一个大顶堆
- 重复步骤2和3，直到有效序列长度为1，则排序完成
### 实现
#### 1.创建一个大顶堆
```javascript
// 将原数组调整为一个对应数组的大顶堆
function buildMaxHeap(array) {
    // 大顶堆的构建是从最后一个非叶子节点开始，从下往上，从右往左调整
    // 最后一个非叶子节点的位置为： Math.floor(array.length/2) - 1
    for (var i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
      adjustHeap(array, i, array.length)
    }
}
/**
* 调整
* @param i 最后一个非叶子节点
* @param length 数组的长度
*/
function adjustHeap(array, i, len) {
    var maxIndex = i; // 最大值索引
    var left = i * 2 + 1; // 左子节点索引
    var right = i * 2 + 2; // 右子节点索引
    // 判断是否有子节点，再比较父节点和左右子节点的大小
    // 因为i是最后一个非叶子节点，所以如果有左右子节点则节点的位置都小于数组的长度
    if (left < len && array[left] > array[maxIndex]) { // 若左子节点比父节点大
      maxIndex = left
    }
    if (right < len && array[right] > array[maxIndex]) { // 若右子节点比父节点大
      maxIndex = right
    }
    // maxIndex为父节点，若发生改变则说明不是最大节点，需要交换
    if (maxIndex != i) {
      [array[maxIndex], array[i]] = [array[i], array[maxIndex]]
      adjustHeap(array, maxIndex, len); // 交换之后递归再次调整比较
    }
}
```
#### 2.堆排序
调用sort方法进行排序
```javascript
var arr = [3, 4, 6, 5, 1, 2]
sort(arr)
function sort(array) {
    var length = array.length;
    buildMaxHeap(array); // 构建一个大顶堆
    // 调整为大顶堆后，顶元素为最大元素并与末尾元素交换
    while (length > 0) { // 当length <= 0时，说明已经到堆顶
      [array[0], array[length - 1]] = [array[length - 1], array[0]]; // 交换
      length--; // 交换之后相当于把树中的最大值弹出去了，所以length--
      adjustHeap(array, 0, length); // 交换值并剔除了最大值后，继续进行调整使之再次成为大顶堆
    }
    return array;
}
```
### 完整代码
```javascript
function heapSort(array) {
  if (array.length <= 1) return array; // 如果数组长度为1，直接返回
  function sort(array) {
    var length = array.length;
    buildMaxHeap(array); // 构建一个大顶堆
    // 调整为大顶堆后，顶元素为最大元素并与末尾元素交换
    while (length > 0) { // 当length <= 0时，说明已经到堆顶
      [array[0], array[length - 1]] = [array[length - 1], array[0]]; // 交换
      length--; // 交换之后相当于把树中的最大值弹出去了，所以length--
      adjustHeap(array, 0, length); // 交换值并剔除了最大值后，继续进行调整使之再次成为大顶堆
    }
    return array;
  }

  // 将原数组调整为一个对应数组的大顶堆
  function buildMaxHeap(array) {
    // 大顶堆的构建是从最后一个非叶子节点开始，从下往上，从右往左调整
    // 最后一个非叶子节点的位置为： Math.floor(array.length/2) - 1
    for (var i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
      adjustHeap(array, i, array.length)
    }
  }

  /**
   * 调整
   * @param i 最后一个非叶子节点
   * @param length 数组的长度
   */
  function adjustHeap(array, i, len) {
    var maxIndex = i; // 最大值索引
    var left = i * 2 + 1; // 左子节点索引
    var right = i * 2 + 2; // 右子节点索引
    // 判断是否有子节点，再比较父节点和左右子节点的大小
    // 因为i是最后一个非叶子节点，所以如果有左右子节点则节点的位置都小于数组的长度
    if (left < len && array[left] > array[maxIndex]) { // 若左子节点比父节点大
      maxIndex = left
    }
    if (right < len && array[right] > array[maxIndex]) { // 若右子节点比父节点大
      maxIndex = right
    }
    // maxIndex为父节点，若发生改变则说明不是最大节点，需要交换
    if (maxIndex != i) {
      [array[maxIndex], array[i]] = [array[i], array[maxIndex]]
      adjustHeap(array, maxIndex, len); // 交换之后递归再次调整比较
    }
  }

  return sort(array)
}
```
### 优化
堆排序是[选择排序](https://juejin.cn/post/7034819462687621133)的改进版\
暂无其他优化想法，欢迎各路大神评论
## 复杂度
| 排序算法 | 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 | 排序方式 | 稳定性
| --- | --- | --- | --- | --- | --- | --- |
| 堆排序 | O(nlogn) | O(nlogn) | O(nlogn) | O(1) | in-place | 不稳定 |
- 时间复杂度
建堆过程的时间复杂度是 `O(n)` ，排序过程的时间复杂度是 `O(nlogn)` ，整体时间复杂度是 `O(nlogn)`
- 空间复杂度
本地排序，空间复杂度`O(1)`
## 其他
[# 前端算法学习-算法复杂度](https://juejin.cn/post/7034077582584709150)\
[# 前端必会算法（一）：冒泡排序](https://juejin.cn/post/7034765646390886437)\
[# 前端必会算法（二）：选择排序](https://juejin.cn/post/7034819462687621133)\
[# 前端必会算法（三）：插入排序](https://juejin.cn/post/7036181901022855175)\
[# 前端必会算法（四）：归并排序](https://juejin.cn/post/7036277115905540103)\
[# 前端必会算法（五）：快速排序](https://juejin.cn/post/7037137749387771940)\
[# 前端必会算法（六）：希尔排序](https://juejin.cn/post/7037775453041459208)\
[# 前端必会算法（七）：计数排序](https://juejin.cn/post/7038521599342936071)\
[# 前端必会算法（八）：桶排序](https://juejin.cn/post/7038608760176115749)\
[# 前端必会算法（九）：基数排序](https://juejin.cn/post/7038900312056266759)

## 最后
**渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正**
### 参考
[# 前端进阶算法9：看完这篇，再也不怕堆排序、Top K、中位数问题面试了](https://juejin.cn/post/6844904179278823437)\
[# 搞定JavaScript算法系列--堆排序](https://juejin.cn/post/6844903830258188296)\
[# 十大排序算法---堆排序](https://juejin.cn/post/6993519369858842661)

