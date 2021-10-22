import React from 'react';
import { useHistory } from 'react-router-dom';
import {Button, Modal, Typography} from '@mui/material';

import './survey-modal.component.scss';

interface SurveyModalComponentProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export const SurveyModalComponent = ({ open, setOpen }: SurveyModalComponentProps): JSX.Element => {
    const history = useHistory();

    const openCompanyFrame = () => {
        setOpen(false);
        history.push('/company-frame');
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <div className="survey-modal">
                <Typography variant="h6" component="h2">
                    Подбор сервисов
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Чтобы наиболее точно выбрать подходящие Вашей ситуации сервисы, пожалуйста, пройдите опрос.
                </Typography>
                <div className="survey-modal__options">
                    <Button color="primary" type="button" variant="contained">
                        Пройти опрос
                    </Button>
                    <Button color="info" type="button" variant="contained" onClick={openCompanyFrame}>
                        Продолжить самостоятельно
                    </Button>
                </div>
            </div>
        </Modal>
    )
};
