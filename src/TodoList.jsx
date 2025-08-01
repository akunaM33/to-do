import TodoListItem from './TodoListItem';

function TodoList({list}) {

  return (
    <ul>
      {list.map((todo) => <TodoListItem key={todo.id} title={todo.title} />)}
    </ul>)
}

export default TodoList;