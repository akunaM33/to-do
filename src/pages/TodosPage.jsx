
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage(props) {

    const { todoState, dispatch } = props;
    const {addTodo} = props;
    const {completeTodo, updateTodo} = props;
    const {sortField, setSortField, sortDirection, setSortDirection, queryString, setQueryString } = props;

    return (
        <div>
            <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

            <TodoList list={todoState.todoList}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
                isLoading={todoState.isLoading}
                isChecked={todoState.isCompleted} dispatch={dispatch} />
            <hr />
            <TodosViewForm
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                queryString={queryString}
                setQueryString={setQueryString} />
        </div>
    );
}

export default TodosPage;