const Table = ({ columns = [], data = [] }) => {
  const gridTemplateColumns = columns
    .map((column) => column.width || "1fr")
    .join(" ");

  return (
    <div className="ui-table">
      <div className="ui-table-head" style={{ gridTemplateColumns }}>
        {columns.map((column) => (
          <span key={column.key}>{column.label}</span>
        ))}
      </div>
      {data.length === 0 ? (
        <div className="ui-table-empty">No records yet.</div>
      ) : (
        data.map((row, index) => (
          <div
            className="ui-table-row"
            style={{ gridTemplateColumns }}
            key={row.id || index}
          >
            {columns.map((column) => (
              <span key={column.key}>{row[column.key]}</span>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Table;
