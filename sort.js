// 冒泡排序: 双层 for 循环实现响铃元素对比
function bubbleSort(list) {
  const length = list.length
  for (let k = 0; k < length; k++) {
    /**
     * 当 k 循环一次就代表最大的元素已经在最后面了,
     * 所以就没有必要再去访问最后一个元素
     */
    for (let j = 0; j < length - k; j++) {
      // 相邻元素比较, 如顺序错误则调换
      if (list[j] > list[j + 1]) {
        let temp = list[j]
        list[j] = list[j + 1]
        list[j + 1] = temp
      }
    }
  }
  return list
}

// 选择排序: 每次循环找到最小值进行赋值
function selectionSort(list) {
  const length = list.length
  let minIndex, temp
  for (let i = 0; i < length; i++) {
    /**
     * 外层循环的每一项与内层循环每一项对比,
     * 找出内层循环中最小于外层项的值
     * 找到后赋值最小项索引, 内层循环结束后调换顺序
     */
    minIndex = i
    for (let j = i + 1; j < length; j++) {
      if (list[j] < list[minIndex]) {
        minIndex = j
      }
    }
    temp = list[minIndex]
    list[minIndex] = list[i]
    list[i] = temp
  }
  return list
}



// 插入排序: 使用额外索引进行位置插入
function insertionSort(list) {
  for (let index = 0; index < list.length; index++) {
    /**
     * 核心: 操作 preIndex 来决定插入的位置, 以及插入的值
     * 上一个如果大于当前则交换位置,
     * 并对 preIndex--, 当减到 -1 或 当前索引的值小于当前值时, 则用当前索引值赋值
     * 赋值时是根据当前移动的索引 +-1 控制的, 当前 for 循环的索引是要插入时的值
     */
    // 当前值一定要缓存下来, 因为当 while 操作时 list 项的顺序会发生变化, 真正赋值时则会出问题
    const current = list[index];
    let preIndex = index - 1
    while (preIndex >= 0 && list[preIndex] > current) {
      list[preIndex + 1] = list[preIndex]
      preIndex--
    }
    list[preIndex + 1] = current
  }
  return list
}

// 希尔排序 -> 递减分组插入对比
function shellSort(arr) {
  const len = arr.length;
  let temp, gap = len, isStop = false;
  // 当间隔小于 0 时条件不成立
  while (gap > 0 && !isStop) {
    // 获取动态间隔
    value = Math.floor(gap/3)
    if (value === 1 || value === 0) {
      isStop = true
      gap = 1
    } else {
      gap = value
    }
    // 循环整个数组, 但按照动态间隔数作为起始循环
    for (let i = gap; i < len; i++) {
      // 暂存间隔起始的每一项
        temp = arr[i];
        // 获取对比索引 = 累加间隔 - 固定间隔
        let j = i - gap;
        // 当对比索引 >= 0 时且 当前对比索引值 > 累加索引值时
        while (j >= 0 && arr[j] > temp) {
          // 当前对比索引与累加索引互换
          // 不要写成 arr[i] = arr[j],
          // 因为 i 是固定的, 而真正要变化的数据是需要下一次要替换或者比较的值,
          // 这样才可以有效的实现递归的向后对比
          arr[j+gap] = arr[j];
          // 当前对比索引 - 固定间隔 = 下一次要对比对比索引
          // 如果下一次的索引 < 0, 或者下一次对比的索引值小于累加索引值时
          // 则结束此次 while 循环
          j -= gap
        }
        // j + gap 的索引 = 有走 while 循环 ? i : 对比后的插入索引
        arr[j + gap] = temp;
    }
  }
  return arr;
}
console.log(shellSort([32,4,2, 324,435,46546,4545]));