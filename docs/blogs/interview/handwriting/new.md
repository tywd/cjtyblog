# 手写-new
## 前言
记录**模拟实现JS中的new过程**的学习总结\
有误请多多指正，附上女神图保命 [手动狗头]\
学习已完成
- [x] 1.new的过程
- [x] 2.模拟手写new
- [x] 3.手写new针对返回值的补充
### 1.new的过程
new做了4件事  [# 前端面试基础-面向对象](https://juejin.cn/post/7080423223313039368#heading-5)
**new做了4件事**
- **1. 创建一个新的空对象**
`var str = new String('1')`
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a099016a6eb54e4ab1adc27421285346~tplv-k3u1fbpfcp-watermark.image?)
- **2. 让子对象继承构造函数的原型对象**
    - 自动让新创建的子对象，继承构造函数的原型对象，即是自动设置子对象的`__proto___ ([[Prototype]])`属性，指向构造函数的原型对象
```
var str = new String('1')
str.__proto__ === String.prototype // true 子对象 str 是继承 String 的原型对象的
```
- **3. 调用构造函数**
    - 将构造函数中的this -> new 创建的新对象 
    - 在构造函数内通过强行赋值方式，为新对象添加规定的属性和方法 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b67fb2a4dc4a46f09394d8fe133cb673~tplv-k3u1fbpfcp-watermark.image?)
从图中可看出 `str` 和 `new String('1')` 是拥有相同的值属性，表明了 `this` 指向的绑定
`new String('1') -> str`
- **4. 返回新对象的地址，保存到 =(等号)左边的变量里**
先测试 `JavaScript` 中自带的 `new`
```js
function Student(sname, sage) {
    this.sname = sname;
    this.sage = sage
    this.intro = function () {
        console.log(this.sname + '今年' + this.sage + '岁');
    }
}
Student.prototype.say = function(name){  console.log(name+'哈哈哈哈哈哈') }
var xiaoming = new Student('小明', 18)
console.log('xiaoming: ', xiaoming);
xiaoming.intro(); // 小明今年18岁
xiaoming.say('小明'); // 小明哈哈哈哈哈哈
console.log('xiaoming.__proto__ === Student.prototype: ', xiaoming.__proto__ === Student.prototype); // true
```
### 2.模拟手写new
根据上面我们知道了`new` 执行了4件事简单封装如下
```js
function newObj(ctx) {
    if (typeof ctx !== 'function') {
        throw new TypeError('The first parameter of newobj must be function');
    }
    var o = Object.create(ctx.prototype); // 1.创建空对象；2.并将新建的o(子对象)继承构造函数的原形对象(ctx.prototype)
    var args = [].slice.call(arguments, 1); // 将arguments转为Array并去除第1个元素(传入的构造函数)
    ctx.call(o, ...args); // 3.改变this指向 将构造函数中的this -> new 创建的新对象
    return o; // 4.返回新对象的地址
}
```
测试结果输出正常
```js
var xiaoming2 = newObj(Student, '小明', 18)
console.log('xiaoming2: ', xiaoming2);
xiaoming2.intro(); // 小明今年18岁
xiaoming2.say('小明'); // 小明哈哈哈哈哈哈
console.log('xiaoming2.__proto__ === Student.prototype: ', xiaoming2.__proto__ === Student.prototype); // true
```
### 3.手写new针对返回值的补充
经测试发现当构造函数内 `return function` 时 `new`后是一个函数`ƒ ()` \
然鹅上面我写的是直接`return`了整个值\
查看下面三个测试例子可得知 我手写的`new`过程与 JS的`new`过程有出入
```js
function TeacherFun(sname) {
    this.sname = sname
    return function () {
        return sname
    }
}
console.log(new TeacherFun('ty')) // ƒ (){ return sname }
console.log(newObj(TeacherFun, 'ty')) // Teacher {sname:'ty'}

function TeacherArr(sname) {
    this.sname = sname
    return [sname, 1]
}
console.log(new TeacherArr('ty')) // ['ty',1]
console.log(newObj(TeacherArr, 'ty')) // TeacherArr {sname:'ty'}

function TeacherObj(sname) {
    this.sname = sname
    // return null
    return { ty: sname }
}
console.log(new TeacherObj('ty')) // {ty: 'ty'}
console.log(newObj(TeacherObj, 'ty')) // TeacherObj {sname:'ty'}
```
开始改造，以下是完整代码，改造我封装的最后两行即可\
对返回值进行了判断三种
- 针对object类型
- 针对function类型
- 针对值类型
接着继续用上面方法进行测试，测试通过
```js
function newObj(ctx) {
    if (typeof ctx !== 'function') {
        throw new TypeError('The first parameter of newobj must be function');
    }
    var o = Object.create(ctx.prototype); // 1创建空对象；2.并将新建的o(子对象)继承构造函数的原形对象(ctx.prototype)
    var args = [].slice.call(arguments, 1); // 将arguments转为Array并去除第1个元素(传入的构造函数)
   // 以下是修改后的内容--------------------⭐️⭐️⭐️⭐️
    var objRes = ctx.call(o, ...args); // 3.改变this指向 将构造函数中的this -> new 创建的新对象
    var isObj = typeof objRes === 'object' && objRes !== null;
    var isFun = typeof objRes === 'function'
    return (isObj || isFun) ? objRes : o; // 4.返回新对象的地址
}
```
## 最后
以上的方式总结只是自己学习总结，有其他方式欢迎各位大佬评论\
**渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正(￣.￣)**\
**有关文章经常被面试问到可以帮忙留下言，小弟也能补充完善完善一起交流学习，感谢各位大佬(～￣▽￣)～**

