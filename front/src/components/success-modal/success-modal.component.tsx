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
                    <u><i>{algorithmName}</i></u> успешно отработал. Были подобраны следующие сервисы:
                    {services.map((service: string) => <p><strong>{service}</strong></p>)}
                    <p>
                        Потребности, с которыми Вы согласны, необходимо внести в поле "сервисы"
                        и сохранить профиль компании. После этого Вы сможете подобрать партнеров.
                    </p>

                </div>
            </div>
        </Modal>
    )
};
