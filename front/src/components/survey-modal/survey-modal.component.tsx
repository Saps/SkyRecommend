import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, Modal, Typography } from '@mui/material';
import { getQuestions } from '~/api';
import type { SurveyValues } from "~/types";

import './survey-modal.component.scss';

interface SurveyModalComponentProps {
    onSubmit: (values: SurveyValues) => void;
    setOpen: (value: boolean) => void;
}

export const SurveyModalComponent = ({ onSubmit, setOpen }: SurveyModalComponentProps): JSX.Element => {
    const [loading, setLoading] = useState<boolean>();
    const { handleChange, handleSubmit, setValues, values } = useFormik({
        initialValues: {} as { [key: string]: boolean },
        onSubmit: async (values: { [key: string]: boolean }) => {
            setOpen(false);
            const result = Object.entries(values).reduce((acc, [key, value]) => ({ ...acc, [key]: +value }), {});
            onSubmit(result);
        }
    });

    const handleGetQuestions = useCallback( async () => {
        try {
            setLoading(true);
            const formValues = (await getQuestions()).reduce((acc, item) => ({ ...acc, [item]: false }), {});
            await setValues(formValues);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [setValues]);

    useEffect(() => {
        handleGetQuestions();
    }, [handleGetQuestions]);

    return (
        <Modal open onClose={setOpen.bind(null, false)}>
            <div className="survey-modal">
                {
                    loading ? (
                        <div className="survey-modal__loader">
                            <CircularProgress size="3rem" />
                        </div>
                    ) : (
                        <>
                            <Typography variant="h6" component="h2">
                                Пожалуйста, отметьте галочками вопросы, на которые Вы хотите ответить "Да"
                            </Typography>
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="survey-modal__questions">
                                    {
                                        Object.entries(values).map(([key, value]) => (
                                            <FormControl className="question-item" key={key}>
                                                <FormControlLabel
                                                    control={<Checkbox checked={value} name={key} onChange={handleChange} value={value} />}
                                                    label={key}
                                                />
                                            </FormControl>
                                        ))
                                    }
                                </div>
                                <div className="survey-modal__options">
                                    <Button color="primary" type="submit" variant="contained">
                                        Сохранить
                                    </Button>
                                    <Button color="info" type="button" variant="contained" onClick={setOpen.bind(null, false)}>
                                        Отменить
                                    </Button>
                                </div>
                            </form>
                        </>
                    )
                }
            </div>
        </Modal>
    )
};
