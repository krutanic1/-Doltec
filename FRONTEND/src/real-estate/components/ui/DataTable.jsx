import React from 'react';

export default function DataTable({ columns = [], rows = [], emptyState = 'No records found.', rowKey = 'id' }) {
  if (!rows.length) {
    return (
      <div style={{ background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 18, padding: 24, color: '#64748b', fontSize: 14 }}>
        {emptyState}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {columns.map((column) => (
              <th key={column.key} style={{ textAlign: 'left', padding: '14px 18px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.12em', color: '#64748b' }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row[rowKey] || index} style={{ borderTop: '1px solid #e2e8f0' }}>
              {columns.map((column) => (
                <td key={column.key} style={{ padding: '14px 18px', fontSize: 14, color: '#0f172a', verticalAlign: 'top' }}>
                  {typeof column.render === 'function' ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
