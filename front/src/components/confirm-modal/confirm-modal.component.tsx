import React from 'react';
import { Button, Modal, Typography } from '@mui/material';

import './confirm-modal.component.scss';

interface ConfirmModalComponentProps {
    info: string;
    onSubmit: () => void;
    setOpen: (value: boolean) => void;
}

export const ConfirmModalComponent = ({ info, onSubmit, setOpen }: ConfirmModalComponentProps): JSX.Element => {
    return (
        <Modal open onClose={setOpen.bind(null, false)}>
            <div className="confirm-modal">
                <Typography variant="h6" component="h2">
                    Подтвердите действие
                </Typography>
                <p className="confirm-modal__info">
                    {info}
                </p>
                <div className="confirm-modal__options">
                    <Button color="primary" type="submit" variant="contained" onClick={onSubmit.bind(null)}>
                        Подтвердить
                    </Button>
                    <Button color="info" type="button" variant="contained" onClick={setOpen.bind(null, false)}>
                        Отменить
                    </Button>
                </div>
            </div>
        </Modal>
    )
};
