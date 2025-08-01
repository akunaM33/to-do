import {useRef} from 'react';

function TodoForm({onAddTodo}) {

    const inputFocus = useRef();
    
    function handleAddTodo(event){
        event.preventDefault();
        const title = event.target.title.value;
        onAddTodo(title);
        event.target.title.value = "";
        inputFocus.current.focus();
    }

    return(
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle" style={{marginRight: 10}}>Todo</label>
            <input id="todoTitle" type='text' name='title' ref={inputFocus}></input>
            <button>Add Todo</button>
        </form>
    )
}

export default TodoForm;