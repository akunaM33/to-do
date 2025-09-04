import {useEffect, useState} from 'react';

function TodosViewForm({ queryString, setQueryString, sortField, setSortField, sortDirection, setSortDirection }) {

    const [localQuery, setLocalQuery] = useState(queryString);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setQueryString(localQuery)
            
        }, 500);
        
        return () => clearTimeout(debounce);

    }, [localQuery, setQueryString]);

    function preventRefresh(event) {
        event.preventDefault();
    }

    return (
        <form onSubmit={preventRefresh}>
            <div>
                <label htmlFor="search" style={{ paddingRight: '10px' }}>Search todos</label>
                <input id="search" type="text" value={localQuery} onChange={(e) => setLocalQuery(e.target.value)}/>
                <button onClick={(e) => setLocalQuery('')}>Clear</button>
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