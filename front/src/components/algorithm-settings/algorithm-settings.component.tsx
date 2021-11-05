import React, {useEffect, useState} from 'react';
import { useFormik } from 'formik';
import { Alert, Button, Checkbox, FormControl, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { getTuneAlgorithms, updateTuneAlgorithms } from '~/api';
import { CommonError, ExtendedAlgorithmData } from '~/types';

export const AlgorithmSettingsComponent = (): JSX.Element => {
    const [algorithmData, setAlgorithmData] = useState<ExtendedAlgorithmData[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>();
    const { handleBlur, handleChange, handleSubmit, isValid, setFieldValue, setValues, values } = useFormik({
        initialValues: {} as { [key: string]: boolean | number },
        onSubmit: async fields => {
            console.log(fields);
        },
    });

    const handleGetAlgorithmData = async () => {
        try {
            setError('');
            setLoading(true);
            const result = await getTuneAlgorithms();
            setAlgorithmData(result);
            await setValues(result.reduce((acc, item) => ({
                ...acc, [`${item.id}-is-enabled`]: !!item.is_enabled, [`${item.id}-weight`]: item.weight
            }), {}));
        } catch (e) {
            console.error(e);
            setError((e as CommonError).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetAlgorithmData();
    }, []);

    return loading ? (
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
                    algorithmData.map(item => (
                        <Grid key={`${item.id}`} container item alignItems="center" pb={2}>
                            <FormControl key={`${item.id}-is-enabled`} sx={{ width: 'calc(100% - 100px)' }}>
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={values[`${item.id}-is-enabled`] as boolean}
                                        name={`${item.id}-is-enabled`}
                                        onChange={handleChange}
                                        value={values[`${item.id}-is-enabled`]}
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
                    <Button color="info" type="button" variant="contained" onClick={handleGetAlgorithmData}>
                        Отменить
                    </Button>
                </Grid>
            </form>
        </Grid>
    )
};
