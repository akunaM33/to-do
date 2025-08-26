import TodoListItem from './TodoListItem';

function TodoList({ list, onCompleteTodo, onUpdateTodo, isLoading }) {

  const filteredTodoList = list.filter((todo) => todo.isCompleted === false);
  
  return (
    <>
      {isLoading ? (<p>Todo list loading ...</p>) :
        (
          <ul>
            {filteredTodoList.length > 0 ? (
              filteredTodoList.map((todo) => <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
              )) : (
              <p>Add Todo above to get started</p>
            )
            }
          </ul>
        )}
    </>
  )
}

export default TodoList;