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
        case actions.fetchTodos: return { ...state, isLoading: true };

        case actions.loadTodos: {
            const fetchedRecords = action.records.map((record) => {
                const todo = {
                    id: record.id,
                    ...record.fields,
                };

                if (!todo.isCompleted) {
                    todo.isCompleted = false;
                }
                return todo;
            });                                             
            
            return { ...state, todoList: fetchedRecords, isLoading: false };
        };

        case actions.setLoadError: return { ...state, errorMessage: action.error.message, isLoading: false };
        ////////////////////////////// Pessimistic UI: /////////////////////////////////////
        case actions.startRequest: return { ...state, isSaving: true };

        case actions.addTodo: {
            const savedTodo = {
                id: action.payload.id,
                title: action.payload.fields.title,
                isCompleted: false
            }
            if (!action.isCompleted) { savedTodo.isCompleted = false; }
                                           
            return { ...state, todoList: [...state.todoList, savedTodo], isSaving: false }
        };

        case actions.endRequest: return { ...state, isLoading: false, isSaving: false };
        ////////////////////////////// Optimistic UI: /////////////////////////////////////
        case actions.revertTodo: {
            const revertedTodos = todoList.map((t) => {
                if (t.id === action.id) {}
            });
        };  //Fall-through logic

        case actions.updateTodo: {
            const patchedTodo = {
                id: action.payload.id,
                ...action.payload.fields,
            };
            if (!action.isCompleted) { patchedTodo.isCompleted = false; }

            const updatedState = {
                ...state,
                todoList: state.todoList.map((item) => item.id === patchedTodo.id ? (
                    { ...item, ...patchedTodo }) : (item)
                )
            };
            return updatedState;
        };

        case actions.completeTodo: {
            const updatedTodos = state.todoList.map((t) => {
                if (t.id === action.id) {
                    return { ...t, isCompleted: true };
                } else {
                    return t;
                }
            });                                       //  console.log("On Complete: ", updatedTodos);
            return { ...state, todoList: [...updatedTodos] };
        };

        case actions.revertTodo: {
            const originalTodo = state.todoList.find((todo) => todo.id === action.id);
            const revertedTodos = state.todoList.map((t) => {
                if (t.id === action.id) { return originalTodo; }
                else { return t; }
            });
            return { ...state, ...revertedTodos};
        }
        case actions.clearError: return { ...state, errorMessage: '', };
    }
}

export { initialState, actions, reducer };