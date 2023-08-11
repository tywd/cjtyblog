const copyJson = (item: any) => {
    return JSON.parse(JSON.stringify(item))
}

// 获取时间点
const getFullTime = (timestamp) => {
    let date = new Date(timestamp);    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    // return Y + M + D + h + m + s;
    return h + m + s;
}

// 获取星期几
const getDay = (day: number) => {
    const arr = ['日', '一', '二', '三', '四', '五', '六']
    return arr[day] ? '周' + arr[day] : null
}

// 以爬取的日期为Key
const getKey = (key: string | number) => {
    const nDate = new Date(Number(key) * 1000)
    const month = nDate.getMonth() === 12 ? 1 : nDate.getMonth()+1
    const date = nDate.getDate()
    const day = getDay(nDate.getDay())
    return `${month}-${date} ${day}`
}

// 当日 Map 以爬取时间点为 Key
const getTimeKey = (key: string) => {
    const nDate = getFullTime(new Date(Number(key) * 1000))
    return nDate
}

// 计算单日每个爬取时间点设备已经消费的金额
const calculateMoney = (f) => {
    const per_money = f.pay_rule.per_money
    const per_time = f.pay_rule.per_time
    const used_time = f.table_order.used_time
    return Math.floor((per_money / per_time) * used_time / 100)
}

/**
 * description 处理源数据为 以单日为 Key 的 Map 数据
 * example 
   Map(1) 
    0: {
        key: "7-16 周日",
        value: Map(2) 
            0: {
                key: "22:09:09",
                value: [{}, {}]
            },
            1: {
                key: "23:13:13",
                value: [{}, {}]
            }
    }
 */ 
export const dataToMap = (data) => {
    const map = new Map()
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const newKey = getKey(key)
            if (map.has(newKey)) {
                const childMap = map.get(newKey)
                childMap.set(getTimeKey(key), data[key])
                map.set(newKey, childMap)
            } else {
                const childMap = new Map()
                childMap.set(getTimeKey(key), data[key])
                map.set(newKey, childMap)
            }
        }
    }
    return map
}

/**
 * description 计算所有收入并以单日为 Key 的 Map
 * Map 的 value 包含 used_time 和 money
 */
export const calculateAllMoney = (data) => {
    const mapData = dataToMap(data) // 将源数据转为map
    const allMap = new Map() // 所有有产生订单的map
    const map = new Map() // 将所有订单根据日期合并后的map
    mapData.forEach((val, key) => {
        val.forEach((val2, key2) => {
            val2.forEach((val3, index) => {
                if (val3.table_order) {
                    allMap.set(val3.table_order.id, {
                        created_at: val3.table_order.created_at,
                        used_time: val3.table_order.used_time, 
                        money: calculateMoney(val3)
                    })
                }
            });
        });
    })
    const item = { money: 0, used_time: 0 }
    allMap.forEach((val, key) => {
        const newKey = getKey(Math.floor(new Date(val.created_at).getTime()/1000))
        if (map.has(newKey)) {
            let data = map.get(newKey)
            data.used_time += val.used_time
            data.money += val.money
            map.set(newKey, data)
        } else {
            const data = copyJson(item)
            data.used_time = val.used_time
            data.money = val.money
            map.set(newKey, data)
        }
    })
    return map
}

// 每日的金额与时间
export const dealEverydayData = (data) => {
    const allMap = calculateAllMoney(data)
    const newItem = getNewItem()
    const seriesData: any[] = []
    const xData: any[] = []
    let allCount = 0;
    let allTime = 0;
    allMap.forEach((val, key) => {
        allCount += val.money
        allTime += val.used_time
        newItem.data.push(val.money)
        xData.push(key)
    })
    seriesData.push(newItem)
    return { xData, seriesData, allCount, allTime }
};

// 将 Map 的所有 key 取出放入一个数组，一般是作为 x 轴的数据
export const dealXData = (mapData) => {
    const data: string[] = []
    mapData.forEach((val, key) => {
        data.push(key)
    })
    return data
}

// 纵坐标的seriesData单个的item数据格式
const getNewItem = () => {
	let item =  {
        name: '', // A01
        type: 'bar',
        data: [],
        markPoint: { data: [ { type: 'max', name: 'Max' }, { type: 'min', name: 'Min' } ] }
    }
    return JSON.parse(JSON.stringify(item))
}

// 处理时间段的数据
export const dealTimeSeriesData = (mapData: any) => {
    const newData: any[] = []
    mapData.forEach((val: any[]) => {
        val.forEach((f: any) => {
            const newItem = getNewItem()
            const fIndex = newData.findIndex((g: any)=> g.name === f.address)
            if (fIndex > -1) {
                if (f.table_order) {
                    newData[fIndex].data.push(f.table_order.used_time)
                } else {
                    newData[fIndex].data.push(0)
                }
            } else {
                newItem.name = f.address
                if (f.table_order) {
                    newItem.data.push(f.table_order.used_time)
                } else {
                    newItem.data.push(0)
                }
                newData.push(newItem)
            }
        });
    });
    // console.log('newData: ', newData);
	return newData;
};

// 处理金额的数据
export const dealMoneySeriesData = (mapData: any) => {
    const newData: any[] = []
    mapData.forEach((val: any[]) => {
        val.forEach((f: any) => {
            const newItem = getNewItem()
            const fIndex = newData.findIndex((g: any)=> g.name === f.address)
            if (fIndex > -1) {
                if (f.table_order) {
                    newData[fIndex].data.push(calculateMoney(f))
                } else {
                    newData[fIndex].data.push(0)
                }
            } else {
                newItem.name = f.address
                if (f.table_order) {
                    newItem.data.push(calculateMoney(f))
                } else {
                    newItem.data.push(0)
                }
                newData.push(newItem)
            }
        });
    });
    // console.log('newData: ', newData);
	return newData;
};

// 以设备做维度，计算单日每个设备的
export const dealDeviceEverydayData = (mapData) => {
    const allMap = new Map() // 过滤所有重复订单，以最后一个订单为准
    const newItem = getNewItem()
    const xData: string[] = []
    const yData: number[] = []
    const seriesData: any[] = []
    mapData.forEach((val: any[], key: string) => {
        val.forEach((item: any) => {
            if (item.table_order) {
                allMap.set(item.table_order.id, {
                    address: item.address,
                    created_at: item.table_order.created_at,
                    used_time: item.table_order.used_time, 
                    money: calculateMoney(item)
                })
            }
            if(xData.length === val.length) return
            yData.push(0)
            xData.push(item.address)
        })
    })
    allMap.forEach((val: any, key: string) => {
        // console.log('val', val)
        const findIndex = xData.findIndex((e) => e === val.address)
        yData[findIndex] += val.money
    })
    newItem.data = yData
    seriesData.push(newItem)
    // console.log('dealDeviceEverydayData', xData, yData, seriesData)
    return { xData, seriesData }
}
