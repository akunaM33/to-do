function TodosViewForm({ queryString, setQueryString, sortField, setSortField, sortDirection, setSortDirection }) {

    function preventRefresh(event) {
        event.preventDefault();
    }

    return (
        <form onSubmit={preventRefresh}>
            <div>
                <label htmlFor="search" style={{ paddingRight: '10px' }}>Search todos</label>
                <input id="search" type="text" value={queryString} onChange={(e) => setQueryString(e.target.value)}/>
                <button onClick={(e) => setQueryString('')}>Clear</button>
            </div>
            <div>
                <label htmlFor="sortBy" style={{ margin: '5px' }}>Sort by:</label>
                <select
                    id="sortBy"
                    name="sortBy"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}>
                    <option value='title'>Title</option>
                    <option value='createdTime'>Time created</option>
                </select>

                <label htmlFor="direction" style={{ margin: '5px' }}>Direction:</label>
                <select
                    id="direction"
                    name="direction"
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}>
                    <option value='asc'>Ascending</option>
                    <option value='desc'>Descending</option>
                </select>
            </div>
        </form>
    )
}

export default TodosViewForm;