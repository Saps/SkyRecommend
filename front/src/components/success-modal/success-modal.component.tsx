import React from 'react';
import { Button, Modal, Typography } from '@mui/material';

import './success-modal.component.scss';

interface SurveyModalComponentProps {
    foundServices: string[];
    foundTasks: string[];
    onCancel: () => void;
    onSubmit: () => void;
}

export const SuccessModalComponent = ({
    foundServices,
    foundTasks,
    onCancel,
    onSubmit
}: SurveyModalComponentProps): JSX.Element => {
    return (
        <Modal open onClose={onCancel.bind(null)}>
            <div className="success-modal">
                <Typography variant="h6" component="h2">
                    Сервисы были успешно подобраны
                </Typography>
                <div className="success-modal__info">
                    <div className="success-modal__container">
                        {
                            foundTasks.length > 0 && (
                                <div>
                                    <p><strong>На основе ответов были выявлены актуальные для Вашей компании бизнес-задачи:</strong></p>
                                    {foundTasks.map((task: string) => <p>{task}</p>)}
                                </div>
                            )
                        }
                        <div>
                            <p><strong>Наиболее эффективными для решения указанных задач являются следующие сервисы:</strong></p>
                            {foundServices.map((service: string) => <p>{service}</p>)}
                        </div>
                    </div>
                    <p>
                        Потребности, с которыми Вы согласны, необходимо внести в поле "сервисы"
                        и сохранить профиль компании. После этого Вы сможете подобрать партнеров.
                    </p>
                </div>
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
