const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: '',
};

const actions = {
    //actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    //found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',
    //actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    //found in helper functions 
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    //reverts todos when requests fail
    revertTodo: 'revertTodo',
    //action on Dismiss Error button
    clearError: 'clearError',
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.fetchTodos: return { ...state };
        case actions.loadTodos: return { ...state };
        case actions.setLoadError: return { ...state, errorMessage: 'failed to load todo' };
        case actions.startRequest: return { ...state, errorMessage: '', isLoading: true };
        case actions.addTodo: {
            const savedTodo = {
                id: records[0].id,
                ...records[0].fields,
            }
            if (!records[0].fields.isCompleted) { savedTodo.isCompleted = false; }
        //    setTodoList([...todoList, savedTodo]);
            return { ...state, savedTodo }
        };
        case actions.endRequest: return { ...state, isLoading: false };
        case actions.updateTodo: return {...state, };
        case actions.completeTodo: return {...state, };
        case actions.revertTodo: return {...state, };
        case actions.clearError: return {...state, errorMessage: '', };
    }
}

export { initialState, actions };