import { memo, useState } from 'react';
import './HttpNode.css';
import { Handle, Position } from 'reactflow';

function HttpNode({ id, data }) {
    const [url, setUrl] = useState('http://localhost:3000/users');
    const [respData, setRespData] = useState(null);
    const [error, setError] = useState(null);

    const fetchUrl = async () => {
        setError(null);
        setRespData(null);

        try {
            if (url) {
                const response = await fetch(url);
                const text = await response.text(); // or response.json() if response is JSON
                const body = await response.json();
                setRespData(text);
                data.onDataFetch(id, body);
            } else {
                throw new Error("URL is not defined");
            }
        } catch (error) {
            setError(error.message);
        }
    };
    return (
        <>
            <div style={{ border: '1px solid #2d2c3d' }}>
                <div className="http-node__header">
                    HttpNode
                    <button className='nodrag' onClick={() => {
                        fetchUrl()
                    }}> start </button>
                </div >
                <div className="http-node__body">
                    <input type="text" id="url-input" placeholder="Enter url here..." defaultValue={url} onChange={(e) => setUrl(e.target.value)} />
                    {respData && (
                        <div>
                            <h3>Response</h3>
                            <pre>{respData}</pre>
                        </div>
                    )}
                    {error && (
                        <div>
                            <h3>Error</h3>
                            <p>{error}</p>
                        </div>
                    )}
                </div>
                <Handle type="source" position={Position.Right} />
            </div>
        </>
    );
}

export default memo(HttpNode);
