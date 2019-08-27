/**
 * 数组
 * 作用：连续存储多个数据
 * 优点：数组在内存中的地址是连续相邻的，可缓存在CPU内部，查询速度比较快
 * 缺点1：在开头/中间 插入、删除 数据执行效率低
 * 缺点2：数组占用的空间大小是有限制的，扩展性不是很好
 * */
let arr = [1, 2, 3];

/**
 * 单链表 【js没有指针的概念，指针指对象地址引用】
 * 作用：非连续存储多个数据
 * 优点：扩展性比较好、存储数据没有限制、链表不需要改变内存的地址，只需要修改节点的信息即可（包括指针指向，节点值）
 * 缺点：查询只能从上往下进行查询，直到查到符合条件的值或结束；查询效率不高
 * */
class LinkedList {
  constructor(element) {
    this.data = null;                                         // 链表数据
    this.length = 0;                                          // 链表长度
    this.lastElement = null;                                  // 最后一个元素
    if (element) {                                            // 初始化链表
      this.data = this._Node(element);
      this.lastElement = this.data;
    }
  }

  /**
   * 创建链表元素结构
   * @param element
   * @param next
   * @return Object
   * */
  _Node(element, next = null) {
    this.length++;
    return {element, next}
  }

  /**
   * 向链表尾部追加元素
   * @param element
   * */
  append(element) {
    if (this.lastElement && this.lastElement instanceof Object) {
      this.lastElement.next = this._Node(element);
      this.lastElement = this.lastElement.next;
    } else {
      this.data = this._Node(element);
      this.lastElement = this.data;
    }
  }

  /**
   * 向链表任意位置添加元素
   * @param index
   * @param element
   * */
  insert(index, element) {
    // 向未位添加元素
    if (!this.lastElement || index >= this.length) return this.append(element);

    // 向首位添加元素
    let newElement = this._Node(element);
    if (index === 0) return newElement.next = this.data, this.data = newElement;

    // 向中间位置添加元素
    let targetIndex = 0, preElement = this.data, targetElement = this.data;
    while (targetIndex < index && targetElement) {
      targetIndex++;
      if (targetIndex === index) preElement = targetElement;
      targetElement = targetElement.next;
    }
    newElement.next = targetElement;
    preElement.next = newElement;
  }

  /**
   * 链表中查找元素并返回索引值
   * @param element
   * */
  indexOf(element) {
    let index = -1;
    let targetElement = this.data || {};
    while (targetElement) {
      index += index === -1 ? 2 : 1;
      targetElement = targetElement.next;
      if (element === targetElement.element) return index;
    }
    return index;
  }

  /**
   * 指定位置删除元素
   * @param index
   * */
  removeAt(index) {
    if (index >= this.length) return false;

    let targetIndex = 0;
    let previousElement = null;
    let targetElement = this.data || {};
    while (targetIndex <= index && targetElement.next) {
      previousElement = targetElement;
      targetElement = targetElement.next;
      targetIndex++;
    }
    previousElement.next = targetElement.next || null;
    this.length--;
    return true;
  }

  /**
   * 链表翻转
   * @param linkList
   * @return Object
   * */
  reverse(linkList) {
    if (this.data === null || !this.data.next) return;

    let cur = linkList;   // 当前元素值
    let pre = null;       // 翻转后next值
    let tmp = null;       // 记录下一个元素值
    while (cur) {
      tmp = cur.next;
      cur.next = pre; // 翻转指针域的指向
      pre = cur;      // 指针往下移动
      cur = tmp;      // 更新当前值
    }
    return  pre;
  }
}

// 向开头位置插入数据；链表比数组快很多
console.log(new Date().getTime());
let linkedListTest = new LinkedList();
for (let index = 0; index <= 10000000; index++) linkedListTest.insert(0, index);
linkedListTest.data = linkedListTest.reverse(linkedListTest.data);
console.log(new Date().getTime(), linkedListTest);

console.log(new Date().getTime());
let arrTest = [];
for (let index = 0; index <= 100000; index++) arrTest.unshift(index);
console.log(new Date().getTime());