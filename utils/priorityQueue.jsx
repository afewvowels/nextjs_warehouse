class Node {
  constructor (val, priority) {
    this.val = val
    this.priority = priority
  }
}

export default class PriorityQueue {
  constructor () {
    this.values = []
  }

  listAll() {
    for (let i = 0; i < this.values.length; i++) {
      console.log(`node ${i}, priority: ${this.values[i].priority}, value:`)
      console.log(this.values[i].val)
    }
  }

  peekHigh() {
    return this.values[0]
  }

  peekLow() {
    return this.values[length - 1]
  }

  enqueue (val, priority) {
    let newNode = new Node (val, priority)
    this.values.push(newNode)
    let index = this.values.length - 1
    const currentNode = this.values[index]

    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2)
      let parentNode = this.values[parentIndex]

      if (parentNode.priority <= currentNode.priority) {
        this.values[parentIndex] = currentNode
        this.values[index] = parentNode
        index = parentIndex
      } else break
    }
  }

  dequeue () {
    const maxNode = this.values[0]
    const endNode = this.values.pop()
    this.values[0] = endNode

    let index = 0
    const length = this.values.length
    const currentNode = this.values[0]
    let isTrue = true
    while (isTrue) {
      let leftChildIndex = 2 * index + 1
      let rightChildIndex = 2 * index + 2
      let leftChildNode, rightChildNode
      let swap = null

      if (leftChildIndex < length) {
        leftChildNode = this.values[leftChildIndex]
        if (leftChildNode.priority > currentNode.priority) swap = leftChildIndex
      }

      if (rightChildIndex < length) {
        rightChildNode = this.values[rightChildIndex]
        if (
          (swap === null && rightChildNode.priority > currentNode.priority) ||
          (swap !== null && rightChildNode.priority > leftChildNode.priority)
        ) { swap = rightChildIndex }
      }

      if (swap === null) {
        isTrue = false
        break
      }

      this.values[index] = this.values[swap]
      this.values[swap] = currentNode
      index = swap
    }

    return maxNode
  }
}