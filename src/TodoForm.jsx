

function TodoForm() {
    return(
        <form>
            <label htmlFor="todoTitle" style={{marginRight: 10}}>Todo</label>
            <input id="todoTitle" type='text'></input>
            <button>Add Todo</button>
        </form>
    )
}

export default TodoForm;