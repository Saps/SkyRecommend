import React from 'react';
import { Button, Modal, Typography } from '@mui/material';

import './success-modal.component.scss';

interface SurveyModalComponentProps {
    algorithmName: string;
    foundServices: string[];
    onCancel: () => void;
    onSubmit: () => void;
}

export const SuccessModalComponent = ({ algorithmName, foundServices, onCancel, onSubmit }: SurveyModalComponentProps): JSX.Element => {
    return (
        <Modal open onClose={onCancel.bind(null)}>
            <div className="success-modal">
                <Typography variant="h6" component="h2">
                    Сервисы были успешно подобраны
                </Typography>
                <div className="success-modal__info">
                    <u><i>{algorithmName}</i></u> успешно отработал. Были подобраны следующие сервисы:
                    {foundServices.map((service: string) => <p><strong>{service}</strong></p>)}
                </div>
                <p>
                    Потребности, с которыми Вы согласны, необходимо внести в поле "сервисы"
                    и сохранить профиль компании. После этого Вы сможете подобрать партнеров.
                </p>
                <div className="success-modal__options">
                    <Button color="primary" type="submit" variant="contained" onClick={onSubmit.bind(null)}>
                        Добавить в сервисы
                    </Button>
                    <Button color="info" type="button" variant="contained" onClick={onCancel.bind(null)}>
                        Отменить
                    </Button>
                </div>
            </div>
        </Modal>
    )
};
