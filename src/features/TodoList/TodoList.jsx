import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import TodoListItem from './TodoListItem';

function TodoList({ list, onCompleteTodo, onUpdateTodo, isLoading, isChecked }) {

  const filteredTodoList = list.filter((todo) => todo.isCompleted === false);
  const [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();

  const itemsPerPage = 5;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  useEffect(() => {
    if (typeof currentPage !== 'number' || currentPage < 1 || currentPage > totalPages) {
      navigate('/');
    }
  }, [currentPage, totalPages, navigate]);

  const currentEntries = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      searchParams.set('page', currentPage - 1);
      setSearchParams(searchParams);
    }
  }
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      searchParams.set('page', currentPage + 1);
      setSearchParams(searchParams);       
    }
  }

  return (
    <>
      {isLoading ? (<p>Todo list loading ...</p>) :
        (<>
          <ul>
            {filteredTodoList.length > 0 ? (
              currentEntries.map((todo) => <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={onUpdateTodo}
                isChecked={isChecked}
              />
              )) : (
              <p>Add Todo above to get started</p>
            )
            }
          </ul>
          <div className="paginationControls">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </>)}
    </>
  )
}

export default TodoList;