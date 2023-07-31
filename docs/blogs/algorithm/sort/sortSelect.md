## 前言
阅读`《学习JavaScript数据结构与算法（第3版）》`有感\
希望自己每次学习算法都能输出一篇博客，收入专栏，检查自身学习情况~ 文章有错欢迎各路大神指正，别喷，硬要喷的话，麻烦轻点，谢谢大神们~
## 开始
选择排序算法是一种原址比较排序算法。他解决了冒泡交换次数过多的毛病

在冒泡排序中比较相邻元素后即互换，需要交换 `O(N^2)` 次

选择排序中只找最小值和原址互换 只用交换 `O(N)`次（这也是选择排序的优点）
### 思路
比如数组 `[5,4,3,2,1]` 
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bf452432c46474c909e04c52a59c754~tplv-k3u1fbpfcp-watermark.image?)
- 由上图可看出，选择排序大致的思路是通过循环找到数据结构中的最小值并将其**和第一位互换位置**，
- 接着第二轮找到第二小的值并将其**和第二位互换位置**，以此类推。
- 外层循环只需要遍历n-1次就行了，因为最后一次，必然剩下了一个元素，不需要再做处理，所以外层循环只需用`array.length - 1`
### 实现
```javascript
function selectSort(array) {
  var sum = 0, // 用来记录循环了多少次
    minIndex = 0; // 最小值的索引
  for (var i = 0; i < array.length - 1; i++) {
    minIndex = i;
    for (let j = i; j < array.length; j++) {
      sum += 1
      if (array[minIndex] > array[j]) {
        minIndex = j
      }
    }
    if (i != minIndex) [array[minIndex], array[i]] = [array[i], array[minIndex]];
  }
  console.log('sum: ', sum); // 14
  return array;
}
var arr = [5, 4, 3, 2, 1];
console.info(selectSort(arr));
```
### 优化
上面代码取自`《学习JavaScript数据结构与算法（第3版）》`，总共需要循环比较 sum = **14次**，这里内层循环j=i，有一个自己和自己比较的过程，这一层是没有必要比较的，每次的比较应该和当前位置的下一个进行比较，优化后只需循环 **10次**
```javascript
function selectSort(array) {
  var sum = 0, // 用来记录循环了多少次
    minIndex = 0; // 最小值的索引
  for (var i = 0; i < array.length - 1; i++) {
    minIndex = i;
    for (let j = i + 1; j < array.length; j++) { // TODO 优化 将 j=i 改为 j=i+1
      sum += 1
      if (array[minIndex] > array[j]) minIndex = j
    }
    if (i != minIndex) [array[minIndex], array[i]] = [array[i], array[minIndex]];
  }
  console.log('sum: ', sum); // 10
  return array;
}
var arr = [5, 4, 3, 2, 1];
console.info(selectSort(arr)); // [1, 2, 3, 4, 5]
```
## 时间复杂度
选择排序同样也是一个复杂度为 **`「O(n²)」`** 的算法。和冒泡排序一样，它包含有嵌套的两个循环，这导致了二次方的复杂度。关于复杂度的分析计算可看 [# 前端算法学习-算法复杂度](https://juejin.cn/post/7034077582584709150)
## 其他
[# 前端算法学习-算法复杂度](https://juejin.cn/post/7034077582584709150)\
[# 前端必会算法（一）：冒泡排序](https://juejin.cn/post/7034765646390886437)
## 最后
**渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正**

