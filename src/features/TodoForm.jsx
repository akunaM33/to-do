import {useRef, useState} from 'react';

function TodoForm({onAddTodo}) {

    const inputFocus = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');
    
    function handleAddTodo(event){
        event.preventDefault();
        // const title = event.target.title.value;
        onAddTodo(workingTodoTitle);
        setWorkingTodoTitle('');
        inputFocus.current.focus();
    }

    return(
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle" style={{marginRight: 10}}>Todo</label>
            <input 
            id="todoTitle" 
            type='text' 
            name='title' 
            ref={inputFocus}
            value = {workingTodoTitle}
            onChange={(e) => setWorkingTodoTitle(e.target.value)}
            ></input>
            <button disabled={!workingTodoTitle}>Add Todo</button>
        </form>
    )
}

export default TodoForm;