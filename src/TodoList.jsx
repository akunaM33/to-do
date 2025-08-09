import TodoListItem from './TodoListItem';

function TodoList({ list, onCompleteTodo }) {

  const filteredTodoList = list.filter((todo) => todo.isCompleted === false);
  
  return (
    <ul>
      {filteredTodoList.length > 0 ? (
        filteredTodoList.map((todo) => <TodoListItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.isCompleted}
          onCompleteTodo={onCompleteTodo}
        />
        )) : (
        <p>Add Todo above to get started</p>
      )
      }
    </ul>)
}

export default TodoList;