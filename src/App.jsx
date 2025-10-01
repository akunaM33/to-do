import { useCallback, useEffect, useReducer, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import styles from './App.module.css';
import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import About from './pages/About';
import NotFound from './pages/NotFound';

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", +title)`;
    }
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [{ queryString, sortField, sortDirection }]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos })
      const options = {
        method: 'GET',
        headers: {
          "Authorization": token
        }
      }
      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }
        const res = await resp.json();
                                                                            // console.log("Fetch Records: ", res.records);
        dispatch({ type: todoActions.loadTodos, records: res.records })
      } catch (error) {
        dispatch({ type: todoActions.setLoadError });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [queryString, sortField, sortDirection]);

  ///////////////////// ADD NEW TODO: /////////////////////////////
  const addTodo = async (todoTitle) => {
    const payload = {
      records: [{
        fields: {
          title: todoTitle,
          isCompleted: false,
        }
      }],
    };
    const options = {
      method: 'POST',
      headers: {
        "Authorization": token, "Content-Type": 'application/json',
      },
      body: JSON.stringify(payload),
    };
    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const res = await resp.json();
      dispatch({ type: todoActions.addTodo, payload: res.records[0] });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }
  //////////////////////////// UPDATE TODO: //////////////////////////////////
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);
    const payload = {
      records: [{
        id: editedTodo.id,
        fields: {
          title: editedTodo.title,
        },
      },],
    };
    const options = {
      method: "PATCH",
      headers: { "Authorization": token, "Content-Type": 'application/json', },
      body: JSON.stringify(payload),
    };
    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) { throw Error(resp.message) }
      const res = await resp.json();

      dispatch({ type: todoActions.updateTodo, payload: res.records[0] });
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      dispatch({ type: actions.revertTodo, payload: id })
    } finally {
      setIsSaving(false);
    }
  }
  //////////////////////////// TODO is Completed:  ////////////////////////////////
  const completeTodo = (id) => {
    dispatch({ type: todoActions.completeTodo, payload: id });
  }
  //////////////////////////// ROUTING  ////////////////////////////////
  const location = useLocation();
  const [title, setTitle] = useState('');
  const showHeader = ['/', '/about'].includes(location.pathname);
  
  useEffect(() => {
    if (location.pathname === '/') { setTitle('Todo List') }
    else if (location.pathname === "/about") { setTitle('About') }
    else { setTitle('') }
  }, [location]);

  const props = {
    todoState, dispatch,
    addTodo, completeTodo, updateTodo,
    sortField, setSortField, sortDirection, setSortDirection, queryString, setQueryString
  }

  return (
    <div className={styles.app}>
      {showHeader && <Header title={title} />}
      <Routes>
        <Route path='/' element={<TodosPage {...props} />} />
        <Route path='/about' element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {errorMessage &&
        <div className={styles.err}><hr /><p>{errorMessage}</p>
          <button onClick={dispatch({ type: actions.clearError })}>Dismiss</button>
        </div>
      }
    </div>
  )
}

export default App
