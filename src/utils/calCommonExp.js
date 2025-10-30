// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
function isOperator(value) {
  var operatorString = '+-*/()×÷'
  return operatorString.indexOf(value) > -1
}

function getPrioraty(value) {
  if (value == '-' || value == '+') {
    return 1
  } else if (value == '*' || value == '/' || value == '×' || value == '÷') {
    return 2
  } else {
    return 0
  }
}

function prioraty(v1, v2) {
  return getPrioraty(v1) <= getPrioraty(v2)
}

function outputRpn(exp) {
  var inputStack = []
  var outputStack = []
  var outputQueue = []
  var firstIsOperator = false
  exp.replace(/\s/g, '')
  if (isOperator(exp[0])) {
    exp = exp.substring(1)
    firstIsOperator = true
  }
  for (var i = 0, max = exp.length; i < max; i++) {
    if (!isOperator(exp[i]) && !isOperator(exp[i - 1]) && i != 0) {
      inputStack[inputStack.length - 1] = inputStack[inputStack.length - 1] + exp[i] + ''
    } else {
      inputStack.push(exp[i])
    }
  }
  if (firstIsOperator) {
    inputStack[0] = -inputStack[0]
  }
  while (inputStack.length > 0) {
    var cur = inputStack.shift()
    if (isOperator(cur)) {
      if (cur == '(') {
        outputStack.push(cur)
      } else if (cur == ')') {
        var po = outputStack.pop()
        while (po != '(' && outputStack.length > 0) {
          outputQueue.push(po)
          po = outputStack.pop()
        }
      } else {
        while (prioraty(cur, outputStack[outputStack.length - 1]) && outputStack.length > 0) {
          outputQueue.push(outputStack.pop())
        }
        outputStack.push(cur)
      }
    } else {
      outputQueue.push(Number(cur))
    }
  }
  if (outputStack.length > 0) {
    while (outputStack.length > 0) {
      outputQueue.push(outputStack.pop())
    }
  }
  return outputQueue
}

function calRpnExp(rpnArr) {
  var stack = []
  for (var i = 0, max = rpnArr.length; i < max; i++) {
    if (!isOperator(rpnArr[i])) {
      stack.push(rpnArr[i])
    } else {
      var num1 = stack.pop()
      var num2 = stack.pop()
      if (rpnArr[i] == '-') {
        var num = num2 - num1
      } else if (rpnArr[i] == '+') {
        var num = num2 + num1
      } else if (rpnArr[i] == '*' || rpnArr[i] == '×') {
        var num = num2 * num1
      } else if (rpnArr[i] == '/' || rpnArr[i] == '÷') {
        var num = num2 / num1
      }
      stack.push(num)
    }
  }
  return stack[0]
}

function calCommonExp(exp) {
  var rpnArr = outputRpn(exp)
  return calRpnExp(rpnArr)
}

export default calCommonExp
