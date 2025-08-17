import TodoListItem from './TodoListItem';

function TodoList({ list, onCompleteTodo, onUpdateTodo }) {

  const filteredTodoList = list.filter((todo) => todo.isCompleted === false);
  
  return (
    <ul>
      {filteredTodoList.length > 0 ? (
        filteredTodoList.map((todo) => <TodoListItem
          key={todo.id}
          // id={todo.id}
          // title={todo.title}
          // completed={todo.isCompleted}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
        )) : (
        <p>Add Todo above to get started</p>
      )
      }
    </ul>)
}

export default TodoList;