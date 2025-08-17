
function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
    return (
        <>
            <label htmlFor={elementId} style={{ marginRight: 10 }}>{labelText}</label>
            <input
                type="text"
                id={elementId}
                ref={ref}
                value={value}
                onChange={onChange}
            />
        </>
    )
}

export default TextInputWithLabel;