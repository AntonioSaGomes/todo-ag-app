import { CircularLinkedList } from "./circularLinkedList";

const priorities = ['low', 'medium', 'high'];

const priorityList = new CircularLinkedList();

priorities.forEach((priority) => {
    priorityList.append(priority);
})


export default function nextPriority(current){
   const priority = priorityList.find(current);
   return priority?.next?.data;
} 