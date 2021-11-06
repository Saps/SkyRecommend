import React, { useState, useEffect, useCallback } from 'react';
import { Alert, CircularProgress, Modal, Typography } from '@mui/material';
import { getServiceCondition } from '~/api';
import type { CommonResponse, ServiceCondition } from '~/types';

import './service-condition-modal.component.scss';

interface ServiceConditionModalComponentProps {
    onClose: () => void;
    serviceId: number;
}

export const ServiceConditionModalComponent = ({ onClose, serviceId }: ServiceConditionModalComponentProps): JSX.Element => {
    const [condition, setCondition] = useState<ServiceCondition>({ message: '', rating: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const getData = useCallback(async () => {
        try {
            const data: ServiceCondition = await getServiceCondition(serviceId);

            setCondition(data);
        } catch (e) {
            setError((e as CommonResponse).message);
        } finally {
            setLoading(false);
        }
    }, [serviceId]);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <Modal open onClose={onClose}>
            <div className="service-condition-modal">
                <button className="close-button" onClick={onClose}>
                    &#10006;
                </button>
                {loading ? (
                    <CircularProgress size="3rem" />
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <div>
                        <Typography variant="h3" textAlign="center" mb={2}>Рейтинг: {condition.rating ?? 0}</Typography>
                        <Typography variant="body1">{condition.message}</Typography>
                    </div>
                )}
            </div>
        </Modal>
    );
};
