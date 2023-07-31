## 前言
阅读`《学习JavaScript数据结构与算法（第3版）》`有感
希望自己每次学习算法都能输出一篇博客，收入专栏，检查自身学习情况~ 文章有错欢迎各路大神指正，别喷，硬要喷的话，麻烦轻点，谢谢大神们~
开始
## 开始
和归并排序一样，快速排序也使用分而治之的方法，将原始数组分为较小的数组（但它没有像归并排序那样将它们分割开）。快速排序比目前学过的其他排序算法要复杂一些，但也是一个分、归、并的过程。

它是从数组中取一个值（n）出来，接着遍历剔除了n的剩下的数组，将小于和大于n的数分别存入数组left和right，然后分别合并left、n、right，递归重复此过程最终排列出来
### 思路
比如数组 `[7,1,6,5,3,2,4]`

分：取中间值5为middle和一个剔除了5的数组
归：遍历剔除了5的数组与5进行比较，小于5的push数组left，大于5的push数组right
并：最后合并数组left.concat(5,right)，单个left和right不断递归重复此步骤来继续进行快排，最后排列好数组

### 实现
```js
function quickSort(array) {
    if (array.length <= 1) return array; // 数组长度小于1 不需再排序，直接返回
    var left = [],
        right = []; 
    var middle = array.splice(Math.floor(array.length / 2), 1)[0] // 将中间值 取出 并在arr中移除
    // 将 中间值与遍历剔除了中间值的数组的元素进行比较
    array.forEach(function (e) {
        e >= middle ? right.push(e) : left.push(e); // 将各自与middle比较后的元素各自归组
    })
    var arr = quickSort(left).concat(middle, quickSort(right)); // 合并各数组（各自未排列好的数组进行递归继续快排）
    return arr;
}
var arr = [7,1,6,5,3,2,4]
console.log(quickSort(arr)) // [1,2,3,4,5,6,7]
```
### 优化
上面的写法比较简单，但需要大量存储空间，毕竟上面使用了闭包，接下来进行优化，直接对原数组进行操作，进行原址互换，不需要额外存储空间
思路

取一个首次比较的值 target
将右侧数组小于target的值 array[r]赋值给array[l]
将左侧侧数组大于等于target的值 array[l]赋值给array[r]
一直到l=r时跳出循环，左侧全部小于target，右侧全部小于target
再通过递归，分别将左侧和右侧的数组继续进行快速排序后返回一直到最后数组排序正确
```js
function quickSort2(array, start, end) {
    if (end - start < 1) return;
    var l = start, // 假设左边数组从索引0开始
        r = end; // 右边数组从索引array.length-1开始
    var target = array[start] // {1} 取首次比较的值
    while (l < r) { // {2} 左边索引 l < 右边索引 r 则继续循环比较
        while (l < r && array[r] >= target) {
            r-- // {3} >=targe时，继续左走进行比较
        }
        array[l] = array[r] // {4} 当数值<target时，将该数值赋值给索引 l (即开始的 0 ) 位置，此时array[r] == array[l]，数组中会有两个相等的值
        while (l < r && array[l] < target) { // {5} 此处会将上面赋值后的 array[l] (即array[r]的值，该值已经小于target) 再和tagrget比较一次，此步有点多余，但暂无优化方法。。。
            l++ // {6} <targe时，继续左走进行比较
        }
        array[r] = array[l] // {7} 当数值>=target时，将该数值赋值给索引 r (即上方已经递减后的索引或者未递减 仍是 0 ) 位置，此时 array[l] == array[r]，数组中会有两个相等的值
    }
    array[l] = target; // {8} 循环到 l>=r时，替换后剩下的target值赋值给 (与array[r] 相等的) array[l]
    quickSort2(array, start, l - 1); // 递归重复该比较过程
    quickSort2(array, l + 1, end); // 递归重复该比较过程
    return array;
}
console.log(quickSort2(arr, 0, arr.length - 1)) // [1,2,3,4,5,6,7]
```
## 复杂度
时间复杂度平均是「O(nlogn)」。最坏情形是，若待排的数组已经是排好序的，该算法将退化成「O(n²)」级的。此时可以通过合理的分区点选择来避免。常见策略有选中间、随机选、三选一等。
若这里我们随机选一个分区点，再与最后的元素交换，就能大概率避免最坏情形的出现。
快速排序是原地算法，不需要额外空间，但递归是需要空间的的（相当于手动维护个调用栈），总体空间复杂度是「O(logn)」。相等元素可能会交换前后顺序，因而不是稳定排序（因为交换）。
## 其他
[# 前端算法学习-算法复杂度](https://juejin.cn/post/7034077582584709150)\
[# 前端必会算法（一）：冒泡排序](https://juejin.cn/post/7034765646390886437)\
[# 前端必会算法（二）：选择排序](https://juejin.cn/post/7034819462687621133)\
[# 前端必会算法（三）：插入排序](https://juejin.cn/post/7036181901022855175)\
[# 前端必会算法（四）：归并排序](https://juejin.cn/post/7036277115905540103)
## 最后
渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正\
### 参考
[# 手写算法并记住它：快速排序（5行代码简单版）](https://juejin.cn/post/6844903938290876430)\
[# 手写算法并记住它：快速排序（最易理解版）](https://juejin.cn/post/6844903938915827725)
