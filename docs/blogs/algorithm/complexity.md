## 前言
阅读`《学习JavaScript数据结构与算法（第3版）》`有感\
数据结构与算法是解决一切编程问题的基础，数据结构是计算机为了高效地利用资源而组织数据的一种方式，了解各种数据结构与算法，用算法增添乐趣、巩固知识、提高编程和解决问题的能力\
算法复杂度又分`时间复杂度` 和 `空间复杂度`
> 担心枯燥的可跳到下面 **时间复杂度 - 3.降低时间复杂度的应用** 看一个例子来增添兴趣
## 大O表示法来表示复杂度
如何衡量算法的效率？通常是用资源，例如CPU（时间）占用、内存占用、硬盘占用和网络占用。当讨论大O表示法时，一般考虑的是CPU（时间）占用。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7a8aac8233348a1899658613e7f7040~tplv-k3u1fbpfcp-watermark.image?)
让我们试着通过时间复杂度的一些例子来理解大O表示法的规则。
## 时间复杂度
**计算方法：将算法执行运算的操作数去除低阶项，再去掉所有系数，可算出复杂度.**
### 1.几种时间复杂度
- #### **常数阶 O(1)**
```javascript
// O(1)
var n = 100;
var a = 10;
console.log(a);
console.log(n);
// 总共执行4次
// 或者
for(var i=0;i<10000;i++){
    console.log(i);
}
// 10000次
```
就算有上万行代码，时间复杂度也是 `O(1)`，因为它的执行次数不会随着任何一个变量（n）的增大而变长
- #### **线性阶 O(n)**
```javascript
// O(n)
for(var i = 1; i <= n; $i++) { 
    console.log(i) 
}
// O(n^2)
function b(n){
    for(var i = 1; i <= n; i++) { 
        for(var j = 1; j <= n; j++) { 
            console.log(j) 
        }
    }
}
// O(2n) == O(n)
function c(n){
    for(var i = 1; i <= n; i++) { 
        console.log(i) 
    }
    for(var j = 1; j <= n; j++) { 
        console.log(j) 
    }
}
```
这两段代码都是随着n的不同，它执行的次数也在发生变化\
**function a** 执行的次数和n是线性关系的，所以它的时间复杂度是`「O(n)」`。\
**function b** 是一个嵌套循环，当n为100的情况下，里边的输出语句就会执行10000次，因此它的时间复杂度就是`「O(n^2)」`。比如冒泡排序的时间复杂度就是`「O(n^2)」`\
**function c** 中循环不是嵌套的，而是并列的，那么它的时间复杂度应该是`「O(2n)」`，因为前边的常数系数我们要去掉，因此它的时间复杂度还是`「O(n)」`
- #### **平方阶 O(n^2)**
参考上方 function b
- #### **平方阶 O(n^3)**
> 参考上面 function b 若再加一层循环就是 **立方阶`「O(n^3)」`**，以此类推
- #### **对数阶 O(logn)**
```javascript
// O(logn)
function d(n){
    var i = 1;
    while(i<n)
    {
        i = i * 2;
    }
}
// O(nlogn)
function e(n){
    for(m=1; m<n; m++) {
        d(n)
    }
}
```
假设**function d**循环次数为x，也就是说 2 的 x 次方等于 n时才跳出循环，执行结束，由2^x=n 得出 x=log₂n。因此这个代码的时间复杂度为`O(logn)`\
**function e** 线性对数阶`O(nlogn)`，就是将时间复杂度为对数阶**function d**的代码循环n遍的话，那么它的时间复杂度就是 n * O(logn) = `O(nlogn)`
- #### **线性对数阶 O(nlogn)**
参考上方
- #### **指数阶 O(2^n)**
表示一个算法的性能会随着数据的每次增加而增大两倍，典型的例子就是**裴波那契数列**的递归计算实现\
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/977bae41d15140afa45f5c3811032bfe~tplv-k3u1fbpfcp-watermark.image?)
斐波那契数列从 0 开始，分别是
```
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233……
```
可以发现规律是 当前的n位置的数值等于前面两个元素之和，即 `arr[n] = arr[n-1]+arr[n-2]`\
用递归方法实现如下
```
function fibonacci(n){
    if(n === 1 || n === 0 ) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}
```
对于**裴波那契数列**有兴趣的可自行前往搜索看下，此处只做简单介绍.
- #### **O(n!)与O(n^n)**
刚开始学习有感，这两个阶段的复杂度没有继续举例，有时间后续更新
### 2. 时间复杂度比较
**常用的时间复杂度从小到大依次是：**\
O(1)<O(logn)<O(n)<O(nlogn)<O(n^2)<O(n^3)<O(2^n)<O(n!)<O(n^n)

此处附上书籍提供的 [大O速查表](https://www.bigocheatsheet.com/)，也可查看这个[复杂度速查表](https://liam.page/2016/06/20/big-O-cheat-sheet/) 链接
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e38577263ce4dcd9cc02bff9074a688~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dafb9570199e450096c870f23cbf2c49~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0af20e57c90d4571bc1cd625cf3d6235~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e40216bf5f3849a1a254ca4b396433a2~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/080311497bfd4fbbb898fdbebdcb4979~tplv-k3u1fbpfcp-watermark.image?)
### 3. 降低时间复杂度的应用
**举个🌰**\
问题：请计算 1 ~ 100 相加之和
最简单粗暴的做法就是 从 1开始 1+2+3+...+100，
```javascript
// 用for循环实现
function f(n){
    let sum = 0
    for(var i=0;i<=n;i++){
        sum+=i
    }
    return sum
}
f(100); // 5050
function g(n){
    let sum = n * (n+1)/2
    return sum
}
g(100); // 5050
```
**function f** 方法的复杂度随着n的改变而增大，执行的次数和n是线性关系，时间复杂度为线性阶`O(n)`\
**function g** 方法只需要执行一行代码 时间复杂度为常数阶`O(1)`\
通过上面例子的对比可看出**function f** 如果n为 10000，100000呢，循环次数可想而知的增大了，而 **function g**代码则更精简，降低了时间复杂度，在实际应用过程中，我们也需要不断的思考降低时间复杂度的方法，不断提高
## 空间复杂度
空间复杂度和时间复杂度的情况其实类似，但是它更加的简单。用最简单的方式来分析即可。主要有两个原则：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c39907786b04a1c82c591454852d604~tplv-k3u1fbpfcp-watermark.image?)
如果你的代码中开了数组，那么数组的长度基本上就是你的空间复杂度。比如你开了一个一维的数组，那么你的空间复杂度就是O(n)，如果开了一个二维的数组，数组长度是n^2，那么空间复杂度基本上就是n^2

如果是有递归的话，那么它递归最深的深度，就是你空间复杂度的最大值。如果你的程序里边递归中又开了数组，那么空间复杂度就是两者的最大值
## 最后
渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正
#### 参考
[斐波那契](https://juejin.cn/post/6844903581829562375)\
[一文吃透时间复杂度和空间复杂度](https://juejin.cn/post/6854573206830448654)


