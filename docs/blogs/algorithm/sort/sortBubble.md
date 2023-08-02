# 冒泡排序
::: tip 前言
阅读`《学习JavaScript数据结构与算法（第3版）》`有感\
希望自己每次学习算法都能输出一篇博客，收入专栏，检查自身学习情况~ 文章有错欢迎各路大神指正，别喷，硬要喷的话，麻烦轻点，谢谢大神们~
:::
## 开始
冒泡排序比较所有相邻的两个项，如果第一个比第二个大，则交换它们。元素项向上移动至正确的顺序，就好像气泡升至表面一样，冒泡排序因此得名。

开始学习排序算法时，通常都先学冒泡算法，因为它在所有排序算法中最简单。然而，从运行时间的角度来看，冒泡排序是最差的一个
### 思路
比如数组 `[5,4,3,2,1]` 如图进行相邻两项的两两比较数值大的往后排
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18aba19b10d945fcabd2ba3f131ac70e~tplv-k3u1fbpfcp-watermark.image?)
- 由上图可看出，相邻两个元素进行比较，四次比较后在左边第5行的 5>1交换数组变成了`[4,3,2,1,5]`第一轮结束之后，最后一个元素的值最大，在`array[4]`
- 由上图可看出，在左边第6行开始第二轮，也是从第一项元素开始相邻两个元素进行比较，但是不用再比较`array[4]`了，它已经是最大的了，左边第9行之后，将第二大的数排在了`array[3]`
- 第一轮除外，以后的每一轮都比前一轮少比较一次，依次为4，3，2，1轮比较，总共比较10轮
- 以此类推，最终都会得出`[1,2,3,4,5]`
### 实现
```javascript
    function bubbleSort(array) {
      var sum = 0; // 用来记录循环了多少次
      for (var i = 0; i < array.length; i++) {
        noswap = true;
        for (var j = 0; j < array.length - 1 - i; j++) {
          sum += 1
          if (array[j] > array[j + 1]) {
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
          }
        }
      }
      console.log('sum: ', sum); // 10
      return array
    }
    var arr = [5, 4, 3, 2, 1]
    console.log(bubbleSort(arr)) // [1,2,3,4,5]
```
### 优化
上面的例子写的`[5,4,3,2,1]`这样的组成数组，需要10次比较，若是`[2,1,3,4,5]`呢？4和5已经是正确位置了，用上面方法仍需要比较10次，接下来进行优化，加一个 `flag`来跳出循环，在某一轮的循环比较结束后，若没发生任何交换，则可认为该数组已达到预期效果，下一轮则没必要继续了，一下写法最终只比较了 **7次**
```javascript
    function bubbleSort(array) {
      if (array.length <= 1)  return array;  // 如果数组长度为1，直接返回
      var sum = 0, // 用来记录循环了多少次
          flag = true; // 用于判断跳出循环  // TODO: 优化
      for (var i = 0; i < array.length; i++) {
        flag = true;
        for (var j = 0; j < array.length - 1 - i; j++) {
          sum += 1
          if (array[j] > array[j + 1]) {
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            flag = false; // TODO: 优化
          }
        }
        // TODO: 优化
        if(flag){
          break;
        }
      }
      console.log('sum: ', sum); // 7
      return array
    }
    var arr = [2,1,3,4,5]
    console.log(bubbleSort(arr)) // [1,2,3,4,5]
```
## 时间复杂度
按最坏时间复杂度来分析，待排序的是像`[5,4,3,2,1]`这种整个逆序的情况。 假设数组中共有 `n` 个元素，第一轮需要比较 `n-1` 次，第二轮需要比较 `n-2` 次，以此类推，最后一轮只需 `1` 次，共比较 `n-1` 轮\
所以时间复杂度 = `(n-1) + (n-2) + ... + 2 + 1 = n(n-1)/2 = ½*n² - ½`\
由上一篇章时间[时间复杂度的计算方法](https://juejin.cn/post/7034077582584709150)可知，**计算方法：将算法执行运算的操作数去除低阶项，再去掉所有系数，可算出复杂度.** \
去掉系数 1/2 得出 最终时间复杂度为 **`「O(n²)」`**
## 最后
**渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正**


