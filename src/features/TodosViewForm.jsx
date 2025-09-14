import { useEffect, useState } from 'react';
import styled from 'styled-components';

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
            <StyledForm>
                <StyledLabel htmlFor="search" >Search todos</StyledLabel>
                <input id="search" type="text" value={localQuery} onChange={(e) => setLocalQuery(e.target.value)} />
                <button onClick={(e) => setLocalQuery('')}>Clear</button>
            </StyledForm>
            <StyledForm>
                <StyledLabel htmlFor="sortBy" >Sort by:</StyledLabel>
                <select
                    id="sortBy"
                    name="sortBy"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}>
                    <option value='title'>Title</option>
                    <option value='createdTime'>Time created</option>
                </select>

                <StyledLabel htmlFor="direction" >Direction:</StyledLabel>
                <select
                    id="direction"
                    name="direction"
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}>
                    <option value='asc'>Ascending</option>
                    <option value='desc'>Descending</option>
                </select>
            </StyledForm>
        </form>
    )
}

const StyledForm = styled.div`
    padding: 0.5rem;
`
const StyledLabel = styled.label`
     margin: 5px;
`

export default TodosViewForm;