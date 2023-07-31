# Object、Map、Set、Array 等转换
## 前言
::: tip 
记录**对象与数组互转**的各种方法\
有误请多多指正 [手动狗头]
:::
学习已完成
- [x] 1.Object 转 Array 之 Object.values()
- [x] 2.Object 转 Array 之  for in
- [x] 3.Array 转 Object
- [x] 4.Map 转 Object
- [x] 4.Set 转 Object

### 1.Object 转 Array 之 Object.values()
```js
const data = {id: 1, value: 2, text: 3}
const arrValue = Object.values(data)
const arrKey = Object.keys(data)
const arrKeyValue = []
for (const [key, value] of Object.entries(data)) {
  arrKeyValue.push({[key]: value})
}
// arrValue [1, 2, 3]
// arrKey [id, value, text]
// arrKeyValue [{id: 1}, {value: 2}, {text: 3}]
```

### 2.Object 转 Array 之  for in
```js
const data = {id: 1, value: 2, text: 3}
const arrValue = []
const arrKey = []
for (let key in data) {
    if (iterable.hasOwnProperty(key)) { // 严谨点，过滤掉在 prototype 上的其他方法
        arrKey.push(key)
        arrValue.push(data[key])
    }
}
// arrValue [1, 2, 3]
// arrKey [id, value, text]
```

### 3.Array 转 Object
```js
const data = [1,2,3]
const obj = {}
data.forEach((e: number, i: number) => {
    obj[i] = e
})
// obj {0: 1, 1: 2, 2: 3}
```

### 4.Map 转 Object
```js
const map1 = new Map();
map1.set('a', 1);
map1.set('b', 2);
map1.set('c', 3);
const obj = {}
for([key,value] of map1) {
    obj[key] = value
}
// obj {a: 1, b: 2, c: 3}
```

### 5.Set 转 Object
```js
let mySet = new Set([1,2])
mySet.add(3)
const obj = {}
for(const value of mySet) {
    obj[value] = value
}
// obj {1: 1, 2: 2, 3: 3}
```
