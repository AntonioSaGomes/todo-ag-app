class Node {
    constructor(data) {
      this.data = data;
      this.next = null;
    }
  }
  
  export class CircularLinkedList {
    constructor() {
      this.head = null;
    }
  
    
    append(data) {
      const newNode = new Node(data);
      if (!this.head) {
        this.head = newNode;
        newNode.next = this.head;
      } else {
        let current = this.head;
        while (current.next !== this.head) {
          current = current.next;
        }
        current.next = newNode;
        newNode.next = this.head;
      }
    }

    find(data) {
        let current = this.head;
        while (current.next !== this.head) {
          if (current.data === data) {
            return current;
          }
          current = current.next;
        }
        if (current.data === data) {
          return current;
        }
        return null;
      }
  }