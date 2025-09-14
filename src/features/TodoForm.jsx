import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

function TodoForm({ isSaving, onAddTodo }) {

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
            
            <StyledButton disabled={workingTodoTitle.trim() === ''}>
            {isSaving ? 'Saving...' : 'Add Todo' }
            </StyledButton>
        </form>
    )
}

const StyledButton = styled.button`
    background: white;
    color: black;
    border-radius: 5px;
    cursor: ${(props) => (props.disabled ? '' : 'pointer')};
    font-style: ${(props) => (props.disabled ? 'italic' : '')};
`
export default TodoForm;