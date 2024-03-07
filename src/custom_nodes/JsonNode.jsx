import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function JsonNode({ data }) {
    let content = <p>No data available</p>;
    if (data && Object.keys(data).length) {
        content = <pre>{JSON.stringify(data, null, 2)}</pre>;
    }
    return (
        <>
            <div style={{ border: '1px solid #2d2c3d' }}>
                {content}
                <Handle type="target" position={Position.Left} />
            </div>
        </>
    );
}

export default memo(JsonNode);
