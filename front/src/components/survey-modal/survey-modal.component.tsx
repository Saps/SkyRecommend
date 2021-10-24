import React, {useEffect, useMemo, useState} from 'react';
import { Formik } from 'formik';
import { Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, Typography } from '@mui/material';
import { getQuestions } from '~/api';
import { SurveyValues } from "~/types";
import './survey-modal.component.scss';

interface SurveyModalComponentProps {
    onSubmit: (values: SurveyValues) => void;
    open: boolean;
    setOpen: (value: boolean) => void;
}

export const SurveyModalComponent = ({ onSubmit, open, setOpen }: SurveyModalComponentProps): JSX.Element => {
    const [questions, setQuestions] = useState<string[]>([]);

    const initialValues = useMemo((): { [key: string]: string } => {
        return questions.reduce((acc, item) => Object.assign(acc, { [item]: '0' }), {});
    }, [questions]);

    const handleGetQuestions = async () => {
        try {
            const questions = await getQuestions();
            setQuestions(questions);
        } catch (err) {
            console.error(err);
        }
    };

    const onFormSubmit = async (values: { [key: string]: string }) => {
        setOpen(false);
        const result = Object.entries(values)
            .reduce((acc, [key, value]) => Object.assign(acc, { [key]: +value }), {});
        onSubmit(result);
    };

    useEffect(() => {
        handleGetQuestions();
    }, []);

    return (
        <Modal open={open} onClose={setOpen.bind(this, false)}>
            <div className="survey-modal">
                <Typography variant="h6" component="h2">
                    Подбор сервисов
                </Typography>
                <Formik initialValues={initialValues} onSubmit={onFormSubmit}>
                    {props => (
                        <form onSubmit={props.handleSubmit} noValidate>
                            <div className="survey-modal__questions">
                                {
                                    questions.map(question => (
                                        <FormControl className="question-item" key={question}>
                                            <FormLabel className="question-item__left">
                                                {question}
                                            </FormLabel>
                                            <RadioGroup
                                                className="question-item__right"
                                                name={question}
                                                onChange={props.handleChange}
                                                value={props.values[question]}
                                            >
                                                <FormControlLabel value="1" label="Да" control={<Radio />} />
                                                <FormControlLabel value="0" label="Нет" control={<Radio />} />
                                            </RadioGroup>
                                        </FormControl>
                                    ))
                                }
                            </div>
                            <div className="survey-modal__options">
                                <Button color="primary" type="submit" variant="contained">
                                    Сохранить
                                </Button>
                                <Button color="info" type="button" variant="contained" onClick={setOpen.bind(this, false)}>
                                    Отменить
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </Modal>
    )
};
