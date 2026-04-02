export const BackButton = ({ navigate, path = "/" }) => (
    <div style={{ margin: '15px' }}>
        <button
            onClick={() => navigate(path)}
            style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
            }}
        >
            Back
        </button>
    </div>
);