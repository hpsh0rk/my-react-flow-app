import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    MiniMap,
    useEdgesState,
    Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';

import './index.css';
import HttpNode from './custom_nodes/HttpNode';
import JsonNode from './custom_nodes/JsonNode';


// 更新nodes状态来传递数据
const handleDataFetch = (sourceNodeId, newData) => {
    setNodes((prevNodes) =>
        prevNodes.map((node) => {
            if (node.data.targetNodeId === sourceNodeId) {
                // 假设`targetNodeId`是我们通过某种方式预先设置的目标节点ID
                return {
                    ...node,
                    data: { ...node.data, json: newData },
                };
            }
            return node;
        })
    );
};

const initialNodes = [
    {
        id: '1',
        type: 'httpNode',
        position: { x: 100, y: 200 },
        data: { onDataFetch: handleDataFetch },
    },
    {
        id: '2',
        type: 'jsonNode',
        position: { x: 250, y: 5 },
    },
];

const minimapStyle = {
    height: 120,
};

const nodeTypes = {
    httpNode: HttpNode,
    jsonNode: JsonNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    return (
        <div className="dndflow" style={{ width: '100vw', height: '100vh' }}>
            <ReactFlowProvider>
                <Sidebar />
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <MiniMap style={minimapStyle} zoomable pannable />
                        <Controls />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
};

export default DnDFlow;
