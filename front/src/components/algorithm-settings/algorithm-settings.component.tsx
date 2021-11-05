import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { Alert, Button, Checkbox, FormControl, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { getTuneAlgorithms, updateTuneAlgorithms } from '~/api';
import { RootState } from '~/store/rootReducer';
import { CommonError, ExtendedAlgorithmSettings } from '~/types';

export const AlgorithmSettingsComponent = (): JSX.Element => {
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const [algorithmSettings, setAlgorithmSettings] = useState<ExtendedAlgorithmSettings[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>();
    const { handleBlur, handleChange, handleSubmit, isValid, setFieldValue, setValues, values } = useFormik({
        initialValues: {} as { [formKey: string]: boolean | number },
        onSubmit: async fields => {
            try {
                const result = Object.entries(fields)
                    .reduce((acc: number[][], [key, value], index: number) => {
                        const [id] = key.split('-');
                        index % 2 < 1 && acc.push([+id]);
                        acc[(index - index % 2) / 2].push(+value);
                        return acc;
                    }, [])
                    .map(([id, is_enabled, weight]) => ({ id, is_enabled, weight }));
                await updateTuneAlgorithms(result);
            } catch (e) {
                console.error(e);
                setError((e as CommonError).message);
            }
        },
    });

    const getAlgorithmSettings = async () => {
        try {
            setError('');
            setLoading(true);
            const result = await getTuneAlgorithms();
            setAlgorithmSettings(result);
            await setValues(result.reduce((acc, item) => ({
                ...acc, [`${item.id}-isEnabled`]: !!item.is_enabled, [`${item.id}-weight`]: item.weight
            }), {}));
        } catch (e) {
            console.error(e);
            setError((e as CommonError).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAlgorithmSettings();
    }, []);

    return user.role !== 'admin' ? (
        <Redirect to="/" />
    ) : loading ? (
        <Alert severity="warning" sx={{ marginTop: 2 }}>Информация загружается.</Alert>
    ) : error ? (
        <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>
    ) : (
        <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
            <Typography variant="h6" component="h2">
                Пожалуйста, отметьте галочками алгоритмы, которые Вы хотите подключить
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
                {
                    algorithmSettings.map(item => (
                        <Grid key={`${item.id}`} container item alignItems="center" pb={2}>
                            <FormControl key={`${item.id}-isEnabled`} sx={{ width: 'calc(100% - 100px)' }}>
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={values[`${item.id}-isEnabled`] as boolean}
                                        name={`${item.id}-isEnabled`}
                                        onChange={handleChange}
                                        value={values[`${item.id}-isEnabled`]}
                                    />}
                                    label={item.caption}
                                />
                            </FormControl>
                            <TextField
                                InputProps={{ inputProps: { type: 'number', min: 0, max: 3, step: 0.1 } }}
                                label={'Вес'}
                                name={`${item.id}-weight`}
                                onBlur={event => {
                                    handleBlur(event);
                                    !event.target.value && setFieldValue(`${item.id}-weight`, 0);
                                }}
                                onChange={event => {
                                    handleChange(event);
                                    +event.target.value < 0 && setFieldValue(`${item.id}-weight`, 0);
                                    +event.target.value > 10 && setFieldValue(`${item.id}-weight`, 10);
                                }}
                                required
                                sx={{ width: '100px' }}
                                value={values[`${item.id}-weight`]}
                                variant="standard"
                            />
                        </Grid>
                    ))
                }
                <Grid container item justifyContent="center" sx={{ gridGap: '16px' }}>
                    <Button color="primary" disabled={!isValid} type="submit" variant="contained">
                        Сохранить
                    </Button>
                    <Button color="info" type="button" variant="contained" onClick={getAlgorithmSettings}>
                        Отменить
                    </Button>
                    <Button color="error" type="button" variant="contained" onClick={() => history.push('/')}>
                        Назад
                    </Button>
                </Grid>
            </form>
        </Grid>
    )
};
