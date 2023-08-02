# order echarts
- 流水
    ```js
    // 当前时间段满足该消费规则
    "pay_rule": {
      "deposit": 6000, // 押金，60元
      "low_money": 0, // 最低金额
      "per_money": 3000, // 金额，单位是分，30元
      "per_time": 60, // 60分钟
      "prepaid": 1000,
      "time": "11:00-24:00",
      "unit": 1
    },
    // 该设备的不同时间段的消费规则
    "pay_rules": [
      {
        "deposit": 6000,
        "low_money": 0,
        "per_money": 2500,
        "per_time": 60,
        "prepaid": 1000,
        "time": "00:00-11:00",
        "unit": 1
      },
      {
        "deposit": 6000,
        "low_money": 0,
        "per_money": 3000,
        "per_time": 60,
        "prepaid": 1000,
        "time": "11:00-24:00",
        "unit": 1
      }
    ],
    ```
- 设备类型 与 数量
- 地区
- 一天中创建订单的时间段
- 已经使用的时间
```js
  // "manager_order"
  "table_order": { 
    ...
      used_time: 180, // 单位分钟
    ...
  }
```
