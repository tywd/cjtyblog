# 数组去重
## 前言
::: tip 
记录**数组去重**的各种方法\
有误请多多指正 [手动狗头]
:::
学习已完成
- [x] 1.Map去重
- [x] 2.Set去重
- [x] 3.filter and indexOf 去重
- [x] 4.reduce and includes 去重

### 1.Map去重
```js
const data = [1,1,2,3,3,4,5,5,5,6,6,6,6]
const removeDuplicatesMap = (data) => {
    const map = new Map()
    for (const iterator of data) {
        map.set(value, iterator)
    }
    const newData = [...map.values()]
    return newData
}
removeDuplicatesMap(data)
```

### 2.Set去重
```js
const data = [1,1,2,3,3,4,5,5,5,6,6,6,6]
const removeDuplicatesSet = (data) => [...new Set(data)]
const removeDuplicatesSet2 = (data) => Array.from(new Set(data))
removeDuplicatesSet(data)
```

### 3.filter and indexOf 去重
```js
// indexOf() 方法返回数组中第一次出现给定元素的下标，如果不存在则返回 -1。
const data = [1,1,2,3,3,4,5,5,5,6,6,6,6]
const removeDuplicates = (data) => {
    const newData = data.filter((item, index, array) => {
        return array.indexOf(item) === index
    })
    return newData
}
removeDuplicates(data)
```

### 4.reduce and includes 去重
```js
const data = [1,1,2,3,3,4]
const uniqueArray = data.reduce((unique, item) => 
  unique.includes(item) ? unique : [...unique, item]
, [])
```