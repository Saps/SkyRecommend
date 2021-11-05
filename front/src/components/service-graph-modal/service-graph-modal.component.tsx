import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Box, Paper, CircularProgress, Alert } from '@mui/material';

import ReactFlow, { Position as ReactFlowNodeHandlerPosition } from 'react-flow-renderer';

import type {
    Node as ReactFlowNode,
    Edge as ReactFlowEdge,
    Elements as ReactFlowElements,
    OnLoadParams as ReactFlowInstance
} from 'react-flow-renderer';

import dagre from 'dagre';

import { getServiceGraph } from '~/api';
import type { ServiceGraph, CommonError } from '~/types';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
}

interface ServiceGraphModalComponentProps {
    serviceId: number;
    onClose: () => void;
}

interface GraphElementData {
    label?: string;
    color?: string;
}

const nodeWidth = 50;
const nodeHeight = 50;

const getLayoutedNodes = (nodes: ReactFlowNode[]): ReactFlowNode[] => {
    const dagreGraph = new dagre.graphlib.Graph();

    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR' });

    nodes.forEach(node => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    dagre.layout(dagreGraph);

    return nodes.map(node => {
        const result = { ...node };
        const positionedNode = dagreGraph.node(node.id);

        result.targetPosition = ReactFlowNodeHandlerPosition.Top;
        result.sourcePosition = ReactFlowNodeHandlerPosition.Bottom;
        result.position = {
            x: positionedNode.x - nodeWidth / 2 + Math.random() / 1000,
            y: positionedNode.y - nodeHeight / 2,
        };

        return result;
    });
};

export const ServiceGraphModalComponent = ({ serviceId, onClose }: ServiceGraphModalComponentProps): JSX.Element => {
    const [graphElements, setGraphElements] = useState<ReactFlowElements<GraphElementData>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const getGraphData = useCallback(async () => {
        try {
            const data: ServiceGraph = await getServiceGraph(serviceId);

            const graphNodes: ReactFlowNode[] = getLayoutedNodes(data.nodes.map(node => (
                {
                    id: String(node.id),
                    data: { label: node.caption },
                    style: {
                        backgroundColor: node.color,
                        width: `${nodeWidth}px`,
                        height: `${nodeHeight}px`,
                        borderRadius: '100%',
                        ...(node.style || {}),
                    },
                    position: { x: Math.round(Math.random() * 100), y : Math.round(Math.random() * 100) }
                }
            )));

            const graphEdges: ReactFlowEdge[] = data.edges.map(edge => (
                { id: String(edge.id), source: String(edge.from), target: String(edge.to), style: edge.style || {} }
            ));

            const elements: ReactFlowElements<GraphElementData> = [...graphNodes, ...graphEdges];

            setGraphElements(elements);
        } catch (e) {
            setError((e as CommonError).message);
        } finally {
            setLoading(false);
        }
    }, [serviceId]);

    useEffect(() => {
        getGraphData();
    }, [getGraphData]);

    const handleReactFlowOnLoad = (reactFlowInstance: ReactFlowInstance) => {
        reactFlowInstance.fitView();
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={modalStyle}>
                <Paper>
                    <Box sx={{ p: 2 }}>
                        <Box component="div" style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            {loading ? (
                                <CircularProgress />
                            ) : error ? (
                                <Alert severity="error">{error}</Alert>
                            ) : (
                                <ReactFlow elements={graphElements} nodesDraggable={false} onLoad={handleReactFlowOnLoad} />
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    );
};