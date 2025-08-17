

function TodoListItem(props) {

    return (
        <li>
            <form name="todos">
                <input type="checkbox"
                    checked={props.completed}
                    onChange={() => props.onCompleteTodo(props.id)}
                />
                {props.title}
            </form>
        </li>
    )
}

export default TodoListItem;