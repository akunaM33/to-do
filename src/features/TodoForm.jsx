import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo }) {

    const inputFocus = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    function handleAddTodo(event) {
        event.preventDefault();
        // const title = event.target.title.value;
        onAddTodo(workingTodoTitle);
        setWorkingTodoTitle('');
        inputFocus.current.focus();
    }

    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                ref={inputFocus}
                value={workingTodoTitle}
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
                elementId="todoTitle"
                labelText="Todo"
            />
            
            <button disabled={!workingTodoTitle}>Add Todo</button>
        </form>
    )
}

export default TodoForm;