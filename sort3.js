const arr = [4,3,6,2,8,1,214,123,21,32,432,5,4325,435,234,324,324]

function bubbleSort(list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length - i; j++) {
      if (list[j] > list[j + 1]) {
        let temp = list[j]
        list[j] = list[j + 1]
        list[j + 1] = temp
      }
    }
  }
  return list
}
// console.log(bubbleSort(arr));
console.log(selectionSort(arr));

function selectionSort(list) {
  for (let i = 0; i < list.length; i++) {
    let minIndex = i
    for (let j = i; j < list.length; j++) {
      if (list[j] < list[minIndex]) {
        minIndex = j
      }
    }
    let temp = list[minIndex]
    list[minIndex] = list[i]
    list[i] = temp
  }
  return list
}

console.log(mergeSort([1,5,4,6,8,0,2]));

function mergeSort(arr) {  // 采用自上而下的递归方法
  var len = arr.length;
  if(len < 2) {
      return arr;
  }
  var middle = Math.floor(len / 2),
      left = arr.slice(0, middle),
      right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right)
{
  var result = [];

  while (left.length && right.length) {
      if (left[0] <= right[0]) {
          result.push(left.shift());
      } else {
          result.push(right.shift());
      }
  }

  while (left.length)
      result.push(left.shift());

  while (right.length)
      result.push(right.shift());

  return result;
}