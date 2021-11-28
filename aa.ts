function aaa(version1, operation, version2) {
  let num1 = version1.split('.').join('');
  let num2 = version2.split('.').join('');
  const maxLength = 4
  while (num1.length < maxLength) {
    num1 += '0'
  }
  while (num2.length < maxLength) {
    num2 += '0'
  }
  return eval(`${num1} ${operation === '=' ? '===' : operation} ${num2}`)
}





console.log(aaa('4.0.1.0', '=' , '0.4.1.0'), '===')
console.log(aaa('4.0.1.0', '>' , '4'), '===')
console.log(aaa('4.0.1.0', '<' , '4.1.0'), '===')