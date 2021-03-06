import React, { useState, useEffect, useCallback } from 'react';
import { Alert, CircularProgress, Modal } from '@mui/material';
import { graphlib, layout } from 'dagre';
import ReactFlow, { Position as ReactFlowNodeHandlerPosition, Controls } from 'react-flow-renderer';
import type {
    Node as ReactFlowNode,
    Edge as ReactFlowEdge,
    Elements as ReactFlowElements,
    OnLoadParams as ReactFlowInstance
} from 'react-flow-renderer';
import { getServiceGraph } from '~/api';
import type { CommonResponse, ServiceGraph } from '~/types';

import './service-graph-modal.component.scss';

interface ServiceGraphModalComponentProps {
    onClose: () => void;
    serviceId: number;
}

interface GraphElementData {
    label?: string;
    color?: string;
}

const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;

const getLayoutNodes = (nodes: ReactFlowNode[], edges: ReactFlowEdge[]): ReactFlowNode[] => {
    const dagreGraph = new graphlib.Graph();

    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR' });

    nodes.forEach(node => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach(edge => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    layout(dagreGraph);

    return nodes.map(node => ({
        ...node,
        targetPosition: ReactFlowNodeHandlerPosition.Top,
        sourcePosition: ReactFlowNodeHandlerPosition.Bottom,
        position: {
            x: dagreGraph.node(node.id).x - NODE_WIDTH / 2 + Math.random() / 1000,
            y: dagreGraph.node(node.id).y - NODE_HEIGHT / 2,
        }
    }));
};

export const ServiceGraphModalComponent = ({ onClose, serviceId }: ServiceGraphModalComponentProps): JSX.Element => {
    const [graphElements, setGraphElements] = useState<ReactFlowElements<GraphElementData>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const getGraphData = useCallback(async () => {
        try {
            const data: ServiceGraph = await getServiceGraph(serviceId);

            const graphNodes: ReactFlowNode[] = data.nodes.map(node => ({
                id: `${node.id}`,
                data: { label: node.caption },
                position: {
                    x: Math.round(Math.random() * 1000),
                    y: Math.round(Math.random() * 1000)
                },
                style: {
                    backgroundColor: node.color,
                    width: 'auto',
                    fontSize: '24px',
                    ...(node.style || {}),
                },
            }));

            const graphEdges: ReactFlowEdge[] = data.edges.map(edge => (
                { id: `${edge.id}`, source: `${edge.from}`, target: `${edge.to}`, style: edge.style || {} }
            ));

            const elements: ReactFlowElements<GraphElementData> = [...getLayoutNodes(graphNodes, graphEdges), ...graphEdges];

            setGraphElements(elements);
        } catch (e) {
            setError((e as CommonResponse).message);
        } finally {
            setLoading(false);
        }
    }, [serviceId]);

    useEffect(() => {
        getGraphData();
    }, [getGraphData]);

    const handleReactFlowOnLoad = (reactFlowInstance: ReactFlowInstance) => {
        setTimeout(() => reactFlowInstance.fitView(), 100);
    };

    return (
        <Modal open onClose={onClose}>
            <div className="service-graph-modal">
                <button className="close-button" onClick={onClose}>
                    &#10006;
                </button>
                {loading ? (
                    <CircularProgress size="3rem" />
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : graphElements.length < 1 ? (
                    <Alert severity="warning">?????? ???????????????????? ?????????? ?????????????????????? ????????????.</Alert>
                ) : (
                    <ReactFlow elements={graphElements} minZoom={0.1} nodesDraggable={false} onLoad={handleReactFlowOnLoad}>
                        <Controls />
                    </ReactFlow>
                )}
            </div>
        </Modal>
    );
};
