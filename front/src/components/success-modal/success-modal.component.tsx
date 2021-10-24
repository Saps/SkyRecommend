import React from 'react';
import { Modal, Typography } from '@mui/material';

import './success-modal.component.scss';

interface SurveyModalComponentProps {
    algorithmName: string;
    open: boolean;
    services: string[];
    setOpen: (value: boolean) => void;
}

export const SuccessModalComponent = ({ algorithmName, open, services, setOpen }: SurveyModalComponentProps): JSX.Element => {
    return (
        <Modal open={open} onClose={setOpen.bind(this, false)}>
            <div className="success-modal">
                <Typography variant="h6" component="h2">
                    Сервисы были успешно подобраны
                </Typography>
                <div className="success-modal__info">
                    {algorithmName} успешно отработал. Были подобраны следующие сервисы:
                    {services.map((service: string) => <p><strong>{service}</strong></p>)}.
                </div>
            </div>
        </Modal>
    )
};
