function  bubbleSort(list) {
  for (let i = 0; i < list.length; i++) {
    for (let k = 0; k < list.length - i; k++) {
      if (list[k] > list[k + 1]) {
        let temp = list[k]
        list[k] = list[k + 1]
        list[k + 1] = temp
      }
    }
  }
  return list
}

function insertion(list) {
  for (let index = 0; index < list.length; index++) {
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
// console.log(insertion([32,42,45,65,765,7,678,1]));

// 希尔排序 -> 插入排序进阶版
function shellSort(arr) {
  const len = arr.length
  let gap = len, temp
  while (gap > 0) {
    gap = Math.floor(gap / 3)
    for (let index = gap; index < len; index++) {
      temp = arr[index];
      let temIndex = index - gap
      while (temIndex >= 0 && arr[temIndex] > temp) {
        // 不要写成 arr[index] = arr[temIndex],
        // 因为 index 是固定的, 而真正要变化的数据是需要下一次要替换或者比较的值,
        // 这样才可以有效的实现递归的向后对比
        arr[temIndex + gap] = arr[temIndex]
        temIndex -= gap
      }
      arr[temIndex + gap] = temp;
    }
  }
  return arr
}
console.log(shellSort([5,4,3,2,1]));

function partition2(arr, low, high) {
  let pivot = arr[low];
  console.log(pivot, 'pivot');
  while (low < high) {
    while (low < high && arr[high] > pivot) {
      --high;
    }
    arr[low] = arr[high];
    console.log(arr, 'high--');
    while (low < high && arr[low] <= pivot) {
      ++low;
    }
    arr[high] = arr[low];
    console.log(arr, 'low--');
  }
  arr[low] = pivot;
  console.log(arr, '================================');
  return low;
}

function quickSort2(arr, low, high) {
  console.log(low, high, 'low-----high');
  if (low < high) {
    let pivot = partition2(arr, low, high);
    console.log(pivot , 'pivot');
    quickSort2(arr, low, pivot - 1);
    quickSort2(arr, pivot + 1, high);
  }
  return arr;
}

const aaa = [9,10,8,7,6,5]
console.log(quickSort2(aaa, 0, aaa.length - 1));