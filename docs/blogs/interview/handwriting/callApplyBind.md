# 手写-call/apply/bind
## 前言
::: tip 
记录**call/apply/bind**的学习总结\
有误请多多指正，附上女神图保命 [手动狗头]
:::
学习已完成
- [x] 1.**call/apply/bind** 的使用
- [x] 2.手写call
- [x] 3.手写apply
- [x] 4.手写bind
### 1.apply/call/bind 的使用
- 1.apply
MDN的定义：**`apply()`**  方法调用一个具有给定`this`值的函数，以及以一个数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的形式提供的参数。
- 2.call
MDN的定义：**`call()`** 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。
>**备注：** call()方法的作用和 apply() 方法类似，区别就是`call()`方法接受的是**参数列表**，而`apply()`方法接受的是**一个参数数组**。
- 3.bind
MDN的定义：**`bind()`** 方法创建一个新的函数，在 **`bind()`** 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
```js
// 举例1
var zhangsan = { sname: '张三' }
var lisi = { sname: '李四' }
function show(a, b) { console.log(this.sname, a, b) }
show.apply(zhangsan, ['ty', 'wd']) // 方法会立刻执行 // 张三 ty wd
show.call(lisi, 'ty', 'wd') // 方法会立刻执行  // 李四 ty wd
var fn = show.bind(zhangsan, 'ty', 'wd') // bind方法不会立刻执行需要调用一下
fn(); // 张三 ty wd

// 举例2
<button>按钮ty</button>
<button>按钮wd</button>
var btns = document.getElementsByTagName('button')
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', e => {
        // 由于此处的箭头函数 this 指向window，用call 绑定 btn的this给show
        show.call(e.target, i + 1) // 分别打印 按钮ty 1 和 按钮wd 2
    })
}
function show(a) { console.log(this.innerHTML, a) }

// 举例3
// 上面获取的btns并不是数组而是一个DOM集合的伪数组，拥有Array的length属性却没有Array的方法
// 假设用Array的forEach循环
Array.prototype.forEach.call(btns, element => {
    console.log('element: ', element); // 正常可遍历输出button元素
});
```
### 2.手写call
- 1.将方法挂载在对象上
- 2.执行对象的方法
- 3.删除刚挂载在对象上的方法
```js
 Function.prototype.tyCall = function (ctx) {
    if (!ctx) ctx = window // undefined 或 null 等则赋值给window
    ctx.fn = this // 1.将方法挂载在对象上
    var paramsArr = [...arguments].slice(1) // 将第一个this 参数删除
    ctx.fn(...paramsArr) // 2.执行对象的方法
    delete ctx.fn  // 3.删除刚挂载在对象上的方法
}
show.tyCall(zhangsan, 'ty', 'wd')
show.call(zhangsan, 'ty', 'wd')
```
### 3.手写apply
步骤同`call`方法，在此基础增加对参数是否是数组的判断
```js
Function.prototype.tyApply = function (ctx) {
    if (!ctx) ctx = window // undefined 或 null 等则赋值给window
    ctx.fn = this
    if (arguments[1] && !(arguments[1] instanceof Array)) { // 传入的参数为非数组则报错
        throw new TypeError('params is no Array')
    }
    ctx.fn(...arguments[1])
    delete ctx.fn
}
show.tyApply(zhangsan, ['ty', 'wd'])
show.apply(zhangsan, ['ty', 'wd'])
```
### 4.手写bind
步骤同call方法，`bind`传参等与`call`相同，在此基础上，增加步骤4如下\
`bind`不会直接调用方法，需要 `return` 方法供外部调用
```js
Function.prototype.tyBind = function (ctx) {
    if (!ctx) ctx = window // undefined 或 null 等则赋值给window
    var self = this
    var paramsArr = [...arguments].slice(1)
    return function () { // 由于bind是不会自动调用方法，此处返回一个方法供调用
        ctx.fn = self // 1.将方法挂载在对象上
         // 将第一个this 参数删除
        ctx.fn(...paramsArr) // 2.执行对象的方法
        delete ctx.fn  // 3.删除刚挂载在对象上的方法
    }
}
show.bind(lisi, 'ty', 'wd')();
show.tyBind(lisi, 'ty', 'wd')();
```
## 最后
以上的方式总结只是自己学习总结，有其他方式欢迎各位大佬评论\
**渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正(￣.￣)**\
**有关该文章经常被面试问到的可以帮忙留下言，小弟也能补充完善完善一起交流学习，感谢各位大佬(～￣▽￣)～**

