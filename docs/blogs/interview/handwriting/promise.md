# 手写-promise
## 前言
持续记录学习手写promise
- [x] 1.定义一个基础promise方法并then结果
- [x] 2.异步执行问题
- [x] 3.then方法链式调用
- [x] 4.then返回Promise处理与then穿透传递
- [x] 5.then代码冗余优化与错误处理catch
- [x] 6.Promise.resolve 与 Promise.reject
- [x] 7.Promise.all
- [x] 8.Promise.race
实践时可同步与原生Promise作对比，更好的了解Promise执行
### 1.定义一个基础promise方法并且then获取结果
```js
(function () {
  function Typromise(executor) { // executor new Promise传进来的方法
    this.state = 'pending' // promise状态，有 fulfilled rejected pending 三种状态
    this.result = '' // new Promise执行的结果
    // 定义new Promise时 executor传进来的两个方法 resolve,reject
    let resolve = (value) => {
      if (this.state === 'pending') { // 在pending时状态可变，经 resolve 后就不会再变
        this.state = 'fulfilled'
        this.result = value
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') { // 在pending时状态可变，经 reject 后就不会再变
        this.state = 'rejected'
        this.result = reason;
      }
    }
    this.then = (onFulfilled, onRejected) => { // then接收两个方法，resolve 或者 reject后执行
      if (this.state === 'fulfilled') { // resolve后，状态为fufilled，执行传进来的onFulfilled方法
        onFulfilled(this.result)
      }
      if (this.state === 'rejected') { // reject后，状态为rejected，执行传进来的onRejected方法
        onRejected(this.result)
      }
    }
    // 执行executor方法时有可能new Promise里面执行出错的时候，这里需要try catch
    try {
      executor(resolve, reject) // 此处执行new Promise时里面执行 resolve 或 reject 方法
    } catch (error) {
      reject(error) // new Promise 里方法报错时的处理
    }
  }
  window.Typromise = Typromise
})()
```
对比测试
```js
console.log('1.-----------------手写promise');
let ty = new Typromise((resolve, reject) => {
    resolve('fulfilled-手写');
    // reject('reject-手写');
    console.log('2.new Typromise')
}).then(value => { 
    console.log('4.value: ', value);
}, error => { 
    console.log('4.error: ', error);
})
console.log('3.-----------------ty')

console.log('1.-----------------原生Promise');
let p = new Promise((resolve, reject) => {
    resolve('fulfilled-官方');
    // reject('reject-官方');
    console.log('2.new Promise')
}).then(value => { 
    console.log('4.value: ', value);
}, error => { 
    console.log('4.error: ', error);
})
console.log('3.-----------------p')
```
<!-- ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd22101535684b8b8ee2a6c9a5dd5e83~tplv-k3u1fbpfcp-watermark.image?) -->
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd22101535684b8b8ee2a6c9a5dd5e83~tplv-k3u1fbpfcp-watermark.image?" data-fancybox="gallery" />
**结论**：上面测试说明第4的输出应该是后于第3的，所以可以认为`then`**里面的方法应该是异步的**
### 2.异步执行问题
#### a.then里的方法是异步执行的
修改`then`方法为异步执行

```js
function Typromise(executor){
    // ···
    this.then = (onFulfilled, onRejected) => { // then接收两个方法，resolve 或者 reject后执行
      if (this.state === 'fulfilled') { // resolve后，状态为fufilled，执行传进来的onFulfilled方法
        setTimeout(() => {
          onFulfilled(this.result)
        });
      }
      if (this.state === 'rejected') { // reject后，状态为rejected，执行传进来的onRejected方法
        setTimeout(() => {
          onRejected(this.result)
        });
      }
    }
    // ···
}
```
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89b41774597e42d6a994e81885fce973~tplv-k3u1fbpfcp-watermark.image?)
#### b.new Promise里的异步执行问题
测试：new Promise存在异步执行 `resolve` 或 `reject` 时的情况
```js
console.log('1.-----------------手写promise');
let ty = new Typromise((resolve, reject) => {
    setTimeout(() => {
        // resolve('fulfilled-手写');
        reject('reject-手写');
        console.log('2.new Typromise')
    }, 1000);
}).then(value => {
    console.log('4.value: ', value);
}, error => {
    console.log('4.error: ', error);
})
console.log('3.-----------------ty')

console.log('1.-----------------原生Promise');
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve('fulfilled-官方');
        reject('reject-官方');
        console.log('2.new Promise')
    }, 1000);
}).then(value => { 
    console.log('4.value: ', value);
}, error => { 
    console.log('4.error: ', error);
})
console.log('3.-----------------p')
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f51b6f886514ffa8a0eca135beea41c~tplv-k3u1fbpfcp-watermark.image?)
**结论**：上图测试说明在`new Promise`里面使用`setTimeout`异步执行后并没有执行`then`方法里的回调返回值，以至于结果*4.value：fulfilled-手写* 并没有出现在log里

修改`then`方法里当遇到`new Promise`异步执行进入等待`pending`状态时的逻辑
- 1.先定义一个存储延迟执行方法的变量 `callback = { }`
- 2.由于`new Promise`里的`resolve`与`reject`在`setTimeout`里异步执行。所以`then`会先执行，此时`state`是`pending`，`then`执行时先将`then`里传进来的`onFulfilled`与`onRejected`存入`callback`中等待异步的`resolve`与`reject`调用
- 3.在`resolve`或`reject`调用时，执行`onFulfilled`或`onRejected`方法
以下标⭐️⭐️为修改的地方
```js
(function () {
  function Typromise(executor) { // executor new Promise传进来的方法
    this.state = 'pending' // promise状态，有 fulfilled rejected pending 三种状态
    this.result = '' // new Promise执行的结果
    this.callback = {} // 定义一个收集方法调用的对象  ⭐️⭐️修改⭐⭐️---------------1.定义callback变量存储
    // 定义new Promise时 executor传进来的两个方法 resolve,reject
    let resolve = (value) => {
      if (this.state === 'pending') { // 在pending时状态可变，经 resolve 后就不会再变
        this.state = 'fulfilled'
        this.result = value
        // ⭐️⭐️修改⭐️⭐---------------3.等待调用
        if (this.callback.onFulfilled) { 
            this.callback.onFulfilled(this.result)
        }
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') { // 在pending时状态可变，经 reject 后就不会再变
        this.state = 'rejected'
        this.result = reason;
        // ⭐️⭐️修改⭐️⭐---------------3.等待调用
        if (this.callback.onRejected) {
            this.callback.onRejected(this.result)
        }
      }
    }
    this.then = (onFulfilled, onRejected) => { // then接收两个方法，resolve 或者 reject后执行
      if (this.state === 'pending') { // 等待状态时，先将回调方法存起来
        this.callback = { // ⭐️⭐修改⭐️⭐---------------------- 2.此处存储异步执行的方法
          onFulfilled,
          onRejected
        }
      }
      if (this.state === 'fulfilled') { // resolve后，状态为fufilled，执行传进来的onFulfilled方法
        setTimeout(() => {
          onFulfilled(this.result)
        });
      }
      if (this.state === 'rejected') { // reject后，状态为rejected，执行传进来的onRejected方法
        setTimeout(() => {
          onRejected(this.result)
        });
      }
    }
    // 执行executor方法时有可能new Promise里面执行出错的时候，这里需要try catch
    try {
      executor(resolve, reject) // 此处执行new Promise时里面执行 resolve 或 reject 方法
    } catch (error) {
      reject(error) // new Promise 里方法报错时的处理
    }
  }
  window.Typromise = Typromise
})()
```
测试正常
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b68a28489fba4a4694b708ac17f9f126~tplv-k3u1fbpfcp-watermark.image?)
### 3.then方法链式调用
#### a.第二个then的调用
分析：
- 1.怎么执行第二个`then`呢？前面了解到`then`方法是通过 `new Promise`里 `resolve` 或 `reject`后才执行的。
- 2.所以手写的`then`方法里也应该是一个`Promise`才能继续执行到`then`
- 3.我们在`then`再执行一次 `resolve` 或 `reject`就会继续执行到下一个`then`，所以在`then`里返回一个新的 `Promise`并执行`resolve` 或 `reject`。
改造 `then` 方法
- 1.将`then`里面的方法用 `new Typromise` 包起来并返回
- 2.在第一个 `then` 里执行 `resolve` 或 `reject` 将值继续返给下一个`then`
以下标⭐️⭐️为修改的地方
```js
// ···
this.then = (onFulfilled, onRejected) => { // then接收两个方法，resolve 或者 reject后执行
 let p = new Typromise((resolve, reject) => { // ⭐️⭐️修改⭐⭐️---------------1.
    if (this.state === 'pending') { // 等待状态时，先将回调方法存起来
      this.callback = {
        onFulfilled,
        onRejected
      }
    }
    if (this.state === 'fulfilled') { // resolve后，状态为fufilled，执行传进来的onFulfilled方法
      setTimeout(() => {
        let res = onFulfilled(this.result) // ⭐️⭐️修改⭐⭐️---------------2.
        resolve(res) // ⭐️⭐️修改⭐⭐️---------------2.
      });
    }
    if (this.state === 'rejected') { // reject后，状态为rejected，执行传进来的onRejected方法
      setTimeout(() => {
        let res = onRejected(this.result) // ⭐️⭐️修改⭐⭐️---------------2.
        resolve(res) // ⭐️⭐️修改⭐⭐️---------------2.这为什么也用resolve，查看下面运行结果分析
      });
    }
  })
  return p // ⭐️⭐️修改⭐⭐️---------------1.
}
// ···
```
测试结果：
```js
console.log('1.-----------------手写promise');
let ty = new Typromise((resolve, reject) => {
    resolve('fulfilled-手写');
    // reject('reject-手写');
    console.log('2.new Typromise')
}).then(value => {
    return value
}, error => { 
}).then(value => {
    console.log('4.value: ', value);
}, error => {
    console.log('4.error: ', error);
})
console.log('3.-----------------ty')

console.log('1.-----------------原生Promise');
let p = new Promise((resolve, reject) => {
    resolve('fulfilled-官方');
    // reject('reject-官方');
    console.log('2.new Promise')
}).then(value => {
    return value
}, error => { 
}).then(value => { 
    console.log('4.value: ', value);
}, error => { 
    console.log('4.error: ', error);
})
console.log('3.-----------------p')
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b29e0133476c49538f7d1046c7459b3e~tplv-k3u1fbpfcp-watermark.image?)
针对代码中为什么在 `this.state === 'rejected'` 时也用`resolve` 是因为新的 promise 默认的状态它就是成功的，即使第一个`then`执行的是`reject`方法也会返回成功到第二个`then`，是不会影响到我们下一个`then`的，可以看以下测试结果对比
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6650cab926d4fee8a696646dac0fd37~tplv-k3u1fbpfcp-watermark.image?)

#### b.第三个then以及之后then的链式调用
分析问题：
- 1.经过上面的改造，进行第三个then调用时的结果并不相同，手写的promise执行完第二个then后，第三个then没有执行
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db9f1ab34573472cb76256a02dcf6e1c~tplv-k3u1fbpfcp-watermark.image?)
- 2.我在then里面打印了 `state` 和 `result`，发现第二个`then`开始的`state`是在`pending`状态，并未改变
```js
console.log('this.state: ', this.state);
console.log('this.result: ', this.result);
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2851a79cee154bb99c3f45dccc5695c6~tplv-k3u1fbpfcp-watermark.image?)
改造 `then` 方法
- 所以我将`then`里`this.state === 'pending'`里的方法也执行 `resolve` 或 `reject` 将值继续返给下一个`then`
基于上面then代码的基础上，以下标⭐️⭐️为修改的地方
```js
// ···
this.then = (onFulfilled, onRejected) => { // then接收两个方法，resolve 或者 reject后执行
  let p = new Typromise((resolve, reject) => {
    if (this.state === 'pending') { // 等待状态时，先将回调方法存起来
     // ⭐️⭐️修改⭐⭐️---------------1.这里改造整个callback
      this.callback = {
        onFulfilled:value=>{
          let res = onFulfilled(this.result)
          resolve(res)
        },
        onRejected:value=>{
          let res = onRejected(this.result)
          resolve(res)
        }
      }
    }
    if (this.state === 'fulfilled') { // resolve后，状态为fufilled，执行传进来的onFulfilled方法
      setTimeout(() => {
        let res = onFulfilled(this.result)
        resolve(res)
      });
    }
    if (this.state === 'rejected') { // reject后，状态为rejected，执行传进来的onRejected方法
      setTimeout(() => {
        let res = onRejected(this.result)
        resolve(res)
      });
    }
  })
  return p
}
// ···
```
测试结果
```js
console.log('1.-----------------手写promise');
let ty = new Typromise((resolve, reject) => {
    resolve('fulfilled-手写');
    // reject('reject-手写');
    console.log('2.new Typromise')
}).then(value => {
    return value
}, error => { 
}).then(value => {
    return value
}, error => { 
}).then(value => {
    console.log('4.value: ', value);
}, error => {
    console.log('4.error: ', error);
})
console.log('3.-----------------ty')

console.log('1.-----------------原生Promise');
let p = new Promise((resolve, reject) => {
    resolve('fulfilled-官方');
    // reject('reject-官方');
    console.log('2.new Promise')
}).then(value => {
    return value
}, error => { 
}).then(value => {
    return value
}, error => { 
}).then(value => { 
    console.log('4.value: ', value);
}, error => { 
    console.log('4.error: ', error);
})
console.log('3.-----------------p')
```
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eef9b63345ca485e9057a914b7927f2c~tplv-k3u1fbpfcp-watermark.image?)
结论：之后只要有返回值继续增加`then`执行也会一直调用，就形成了链式调用

### 4.then方法返回promise的处理与then穿透
#### a.返回promise处理
- 分析：我们手写的`promise`当`then`里返回`promise`时下一个`then`没有返回`value`而是直接返回了`promise`
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3089d3bc7194902855dc06ba4af13ed~tplv-k3u1fbpfcp-watermark.image?)
继续改造 `then`方法，将返回的两种类型进行区分，**区分`return`的是 `Typromise`类型还是纯 值类型**\
基于上面then代码的基础上，以下标⭐️⭐️为修改的地方
```js
this.then = (onFulfilled, onRejected) => { // then接收两个方法，resolve 或者 reject后执行
  let p = new Typromise((resolve, reject) => {
    if (this.state === 'pending') { // 等待状态时，先将回调方法存起来
      this.callback = {
        onFulfilled: value => {
          let res = onFulfilled(this.result)
          // START⭐️⭐️修改⭐⭐️---------------resolve(res)修改
          if (res instanceof Typromise) {
            res.then(value=>{
              resolve(value)
            },reason=>{
              reject(reason)
            })
          } else {
            resolve(res)
          }
          // END⭐️⭐️修改⭐⭐️---------------resolve(res)修改
        },
        onRejected: value => {
          let res = onRejected(this.result)
          // START⭐️⭐️修改⭐⭐️---------------resolve(res)修改
          if (res instanceof Typromise) {
            res.then(value=>{
              resolve(value)
            },reason=>{
              reject(reason)
            })
          } else {
            reject(res)
          }
          // END⭐️⭐️修改⭐⭐️---------------resolve(res)修改
        },
      }
    }
    if (this.state === 'fulfilled') { // resolve后，状态为fufilled，执行传进来的onFulfilled方法
      setTimeout(() => {
        let res = onFulfilled(this.result)
        // START⭐️⭐️修改⭐⭐️---------------resolve(res)修改
        if (res instanceof Typromise) {
          res.then(value=>{
            resolve(value)
          },reason=>{
            reject(reason)
          })
        } else {
          resolve(res)
        }
        // END⭐️⭐️修改⭐⭐️---------------resolve(res)修改
      });
    }
    if (this.state === 'rejected') { // reject后，状态为rejected，执行传进来的onRejected方法
      setTimeout(() => {
        let res = onRejected(this.result)
        // START⭐️⭐️修改⭐⭐️---------------resolve(res)修改
        if (res instanceof Typromise) {
          res.then(value=>{
            resolve(value)
          },reason=>{
            reject(reason)
          })
        } else {
          reject(res)
        }
        // END⭐️⭐️修改⭐⭐️---------------resolve(res)修改
      });
    }
  })
  return p
}
```
可以看出上面有很多冗余的代码，完善功能后下面将进行优化\
测试结果：
```js
console.log('1.-----------------手写promise');
let ty = new Typromise((resolve, reject) => {
    resolve('fulfilled-手写');
    // reject('reject-手写');
    console.log('2.new Typromise')
}).then(value => {
    return new Typromise((resolve,reject)=>{
        resolve(value)
        // reject(value)
    })
}, error => { 
}).then(value => {
    return new Typromise((resolve,reject)=>{
        resolve(value)
        // reject(value)
    })
}, error => { 
}).then(value => {
    console.log('4.value: ', value);
}, error => {
    console.log('4.error: ', error);
})
console.log('3.-----------------ty')

console.log('1.-----------------原生Promise');
let p = new Promise((resolve, reject) => {
    resolve('fulfilled-官方');
    // reject('reject-官方');
    console.log('2.new Promise')
}).then(value => {
    return new Promise((resolve,reject)=>{
        resolve(value)
        // reject(value)
    })
}, error => { 
}).then(value => {
    return new Promise((resolve,reject)=>{
        resolve(value)
        // reject(value)
    })
}, error => { 
}).then(value => { 
    console.log('4.value: ', value);
}, error => { 
    console.log('4.error: ', error);
})
console.log('3.-----------------p')
```
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08ad88c2c33d4b399778501991379d8b~tplv-k3u1fbpfcp-watermark.image?)
#### b.then穿透传递
- 分析：原生的`then()`即使传递了一个空值下一个`then()`也能收到`promise`中`resolve`或`reject`执行之后的值，而手写由于传了空值而直接报错，**所以我们需要在`then`里做下方法非空校验并且还需要穿透传递值**
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27cbd7d791034038bdd0fce75258c385~tplv-k3u1fbpfcp-watermark.image?)
继续改造 `then` 方法\
基于上面then代码的基础上，以下标⭐️⭐️为修改的地方
```js
// ···
this.then = (onFulfilled, onRejected) => { // then接收两个方法，resolve 或者 reject后执行
    // START⭐️⭐️修改⭐⭐️---------------新增传入的函数判断
    if (!(onFulfilled instanceof Function)) {
        onFulfilled = value => value // 当是空时，直接把值传给下一个then
    }
    if (!(onRejected instanceof Function)) {
        onRejected = reason => reason // 当是空时，直接把值传给下一个then
    }
    // END⭐️⭐️修改⭐⭐️---------------新增传入的函数判断
    let p = new Typromise((resolve, reject) => {
    // ···
    })
    // ···
})
```
测试结果：
```js
console.log('1.-----------------手写promise');
let ty = new Typromise((resolve, reject) => {
    resolve('fulfilled-手写');
    // reject('reject-手写');
    console.log('2.new Typromise')
}).then().then(value => {
    console.log('4.value: ', value);
}, error => {
    console.log('4.error: ', error);
})
console.log('3.-----------------ty')

console.log('1.-----------------原生Promise');
let p = new Promise((resolve, reject) => {
    resolve('fulfilled-官方');
    // reject('reject-官方');
    console.log('2.new Promise')
}).then().then(value => { 
    console.log('4.value: ', value);
}, error => { 
    console.log('4.error: ', error);
})
console.log('3.-----------------p')
```
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d79a0623e5334eeeba4f076ef5973071~tplv-k3u1fbpfcp-watermark.image?)

### 5.then错误处理与代码冗余优化
#### a.返回promise类型约束，预防用户在 new Promise时返回了自身 陷入死循环
如
```js
let p = new Promise((resolve, reject) => {
    return p; // 在此返回了自身
}).then(value => {
    return new Promise(resolve=>{
        resolve(value)
    })
}, error => { 
})
```
加入检验
```js
if (p === res) {
    throw new TypeError('Chaining cycle detected for promise #<Typ romise>')
}
```
#### b.错误处理
每当`then`里执行错误的语法直接报错时`try catch`处理`reject`一下让错误能被下一个`then()的reject`捕获
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e61070f5aa14669b87aa464f5ac7eb4~tplv-k3u1fbpfcp-watermark.image?)
#### c.封装冗余代码parse并贴上完整代码
- 封装`parse`方法处理冗余代码
- 实现`catch()`方法\
    `promise.then().catch() `的`catch()`方法返回一个`Promise`，并且处理拒绝的情况。因为`then`方法的第二个参数其实就是做这件事的，catch只是另一个名称罢了。当`then`方法的第二参数没有时，会自动由`catch`接手
以下标⭐️⭐️为修改的地方
```js
(function () {
  function Typromise(executor) { // executor new Promise传进来的方法
    this.state = 'pending' // promise状态，有 fulfilled rejected pending 三种状态
    this.result = '' // new Promise执行的结果
    this.callback = {} // 定义一个收集方法调用的对象
    // START⭐️⭐️修改⭐⭐️---------------新增parse封装方法处理代码冗余
    let parse = (p, res, resolve, reject, type) => {
      if (p === res) { // 返回promise类型约束，预防用户在 new Promise时返回自身 陷入死循环
        throw new TypeError('Chaining cycle detected for promise #<Typromise>')
      }
      if (res instanceof Typromise) {
        /*  res.then(value=>{
           resolve(value)
         },value=>{
           reject(value)
         }) */
        res.then(resolve, reject) // 上面方法可简写
      } else {
        type == 'resolve' ? resolve(res) : reject(res)
      }
    }
    // END⭐️⭐️修改⭐⭐️---------------新增parse封装方法处理代码冗余
    // 定义new Promise时 executor传进来的两个方法 resolve,reject
    let resolve = (value) => {
      if (this.state === 'pending') { // 在pending时状态可变，经 resolve 后就不会再变
        this.state = 'fulfilled'
        this.result = value
        if (this.callback.onFulfilled) {
          setTimeout(() => {
            this.callback.onFulfilled(this.result)
          });
        }
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') { // 在pending时状态可变，经 reject 后就不会再变
        this.state = 'rejected'
        this.result = reason;
        if (this.callback.onRejected) {
          setTimeout(() => {
            this.callback.onRejected(this.result)
          });
        }
      }
    }
    this.then = (onFulfilled, onRejected) => { // then接收两个方法，resolve 或者 reject后执行
      if (!(onFulfilled instanceof Function)) {
        onFulfilled = value => value // 当是空时，直接把值传给下一个then
      }
      if (!(onRejected instanceof Function)) {
        onRejected = reason => reason // 当是空时，直接把值传给下一个then
      }
      let p = new Typromise((resolve, reject) => {
        if (this.state === 'pending') { // 等待状态时，先将回调方法存起来
          this.callback = {
            onFulfilled: value => {
              // START⭐️⭐️修改⭐⭐️---------------捕获错误
              try {
                parse(p, onFulfilled(value), resolve, reject, 'resolve')
              } catch (error) {
                reject(error)
              }
              // END⭐️⭐️修改⭐⭐️---------------捕获错误
            },
            onRejected: value => {
              // START⭐️⭐️修改⭐⭐️---------------捕获错误
              try {
                parse(p, onRejected(value), resolve, reject, 'reject')
              } catch (error) {
                reject(error)
              }
              // END⭐️⭐️修改⭐⭐️---------------捕获错误
            },
          }
        }
        if (this.state === 'fulfilled') { // resolve后，状态为fufilled，执行传进来的onFulfilled方法
          setTimeout(() => {
            // START⭐️⭐️修改⭐⭐️---------------捕获错误
            try {
              parse(p, onFulfilled(this.result), resolve, reject, 'resolve')
            } catch (error) {
              reject(error)
            }
            // END⭐️⭐️修改⭐⭐️---------------捕获错误
          });
        }
        if (this.state === 'rejected') { // reject后，状态为rejected，执行传进来的onRejected方法
          setTimeout(() => {
            // START⭐️⭐️修改⭐⭐️---------------捕获错误
            try {
              parse(p, onRejected(this.result), resolve, reject, 'reject')
            } catch (error) {
              reject(error)
            }
            // END⭐️⭐️修改⭐⭐️---------------捕获错误
          });
        }
      })
      return p
    }
    // START⭐️⭐️修改⭐⭐️---------------新增catch方法捕获错误
    // catch方法只有一个参数用于处理错误的情况
    this.catch = onRejected => {
      return this.then(null, onRejected)
    }
    // END⭐️⭐️修改⭐⭐️---------------新增catch方法捕获错误
    // 执行executor方法时有可能new Promise里面执行出错的时候，这里需要try catch
    try {
      executor(resolve, reject) // 此处执行new Promise时里面执行 resolve 或 reject 方法
    } catch (error) {
      reject(error) // new Promise 里方法报错时的处理
    }
  }
  window.Typromise = Typromise
})()
```
### 6.Promise.resolve 与 Promise.reject
```js
// ···
Typromise.resolve = (value) => {
    return new Typromise((resolve, reject) => {
      if (value instanceof Typromise) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
}
Typromise.reject = (value) => {
    return new Typromise((resolve, reject) => {
        reject(value)
    })
}
window.Typromise = Typromise
```
测试结果
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b36ce9f39c5c42a49c70e3704749266a~tplv-k3u1fbpfcp-watermark.image?)
**结论：Typromise.reject必须也是异步**
```js
Typromise.reject = (value) => {
    return new Typromise((resolve, reject) => {
        setTimeout(() => {
            reject(value)
        })
})
```
测试结果正常
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8b8a271f26349d099df737304a26c08~tplv-k3u1fbpfcp-watermark.image?)
### 7.Promise.all
- 1.`Promise.all(promises)` 传入参数`promises`的必须是一个**Array类型**，若是**string类型**会直接返回，若是其他类型则报错
- 2.`Promise.all` 是必须所有请求成功后才可`resolve`值，若有一个失败则直接`reject`
```js
// ···
Typromise.all = (promises) => {
    return new Promise((resolve, reject) => {
      if (typeof promises === 'object' && promises instanceof Array) {
        const values = [];
        promises.forEach(promise => {
          promise.then(value => {
            values.push(value)
            if (promises.length === values.length) { // 必须全部成功才可resolve
              resolve(values)
            }
          }, reason => { // 有一个失败则直接reject
            reject(reason)
          })
        })
      } else {
        if (typeof promises === 'string') { // string类型会直接返回
          resolve(promises)
        } else {
          throw new TypeError(typeof promises + ' ' + promises + ' is not iterable (cannot read property Symbol(Symbol.iterator))')
        }
      }
   })
}
window.Typromise = Typromise
```
测试结果：
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d65d613742bc44428c8b568fe1ad15ff~tplv-k3u1fbpfcp-watermark.image?)
### 8.Promise.race
- 1.`Promise.race(promises)` 传入参数`promises`的必须是一个**Array类型**，若是**string类型**会直接返回，若是其他类型则报错
- 2.`Promise.race` 是哪个请求成功返回较快就用哪个的值，谁先失败也结束直接用失败的结果
```js
Typromise.race = (promises) => {
    return new Promise((resolve, reject) => {
      if (typeof promises == 'object' && promises instanceof Array) {
        const values = [];
        promises.forEach(promise => {
          promise.then(value => {
            resolve(value)
          }, reason => {
            reject(reason)
          })
        })
      } else {
        if (typeof promises == 'string') { // string类型会直接返回
          resolve(promises)
        } else {
          throw new TypeError(typeof promises + ' ' + promises + ' is not iterable (cannot read property Symbol(Symbol.iterator))')
        }
     }
  })
}
window.Typromise = Typromise
```
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/920e855106354ed586192486274e2e1f~tplv-k3u1fbpfcp-watermark.image?)

## 最后
以上的方式总结只是自己学习总结，有其他方式欢迎各位大佬评论\
**渣渣一个，欢迎各路大神多多指正，不求赞，只求监督指正(￣.￣)**\
**有关文章经常被面试问到可以帮忙留下言，小弟也能补充完善完善一起交流学习，感谢各位大佬(～￣▽￣)～**