import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Box, Paper, CircularProgress, Alert, Typography } from '@mui/material';

import { getServiceCondition } from '~/api';
import type { ServiceCondition, CommonError } from '~/types';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
}

interface ServiceConditionModalComponentProps {
    serviceId: number;
    onClose: () => void;
}

export const ServiceConditionModalComponent = ({ serviceId, onClose }: ServiceConditionModalComponentProps): JSX.Element => {
    const [condition, setCondition] = useState<ServiceCondition>({ message: '', rating: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const getData = useCallback(async () => {
        try {
            const data: ServiceCondition = await getServiceCondition(serviceId);

            setCondition(data);
        } catch (e) {
            setError((e as CommonError).message);
        } finally {
            setLoading(false);
        }
    }, [serviceId]);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <Modal open onClose={onClose}>
            <Box sx={modalStyle}>
                <Paper>
                    <Box sx={{ p: 2 }}>
                        <Box component="div" style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            {loading ? (
                                <CircularProgress size="3rem" />
                            ) : error ? (
                                <Alert severity="error">{error}</Alert>
                            ) : (
                                <Box component="div">
                                    <Typography variant="h3" textAlign="center" mb={2}>Рейтинг: {condition.rating}</Typography>
                                    <Typography variant="body1">{condition.message}</Typography>
                                </Box>
                                
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    );
};
