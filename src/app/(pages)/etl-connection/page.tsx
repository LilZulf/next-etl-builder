"use client";
import { Box, Paper, Typography, CircularProgress, Grid2, Button, Modal, TextField, InputAdornment, MenuItem } from '@mui/material';
import React from 'react';
import { getEtlConnection, postEtlConnection, deleteEtlConnection } from '@/app/api/services';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Add, Close, Search } from '@mui/icons-material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import EtlConnectionResponse from './response-interface';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function EtlConnection() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const submitConnection = useMutation({
        mutationFn: (values: any) =>
            postEtlConnection(values),
        onSuccess: () => {
            toast.success("Connection added");
            queryClient.invalidateQueries({ queryKey: ["etl-connection"] });

        }
    });
    const deleteConnection = useMutation({
        mutationFn: (id: string) =>
            deleteEtlConnection(id),
        onSuccess: () => {
            toast.success("Connection deleted");
            queryClient.invalidateQueries({ queryKey: ["etl-connection"] });
        }
    })

    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ["etl-connection"],
        queryFn: () => getEtlConnection(),
    });

    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDeleteOpen = (id: string) => {
        setSelectedId(id);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setSelectedId(null);
        setDeleteOpen(false);
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const InnerCard = (item: EtlConnectionResponse) => {
        return (
            <React.Fragment>
                <CardContent>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {item.name}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {item.host}{item.port && ":" + item.port}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{item.db_client}</Typography>
                    <Typography variant="body2">
                        {item.username}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => router.push(`/etl-connection/${item.id}`)}>Detail Connection</Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteOpen(item.id)}
                    >
                        Delete
                    </Button>
                </CardActions>
            </React.Fragment>
        );
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        host: Yup.string().required('Host is required'),
        port: Yup.number().nullable().positive('Port must be a positive number'),
        database: Yup.string().required('Database is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string(),
        db_client: Yup.string().required('DB Client is required'),
    });


    const dataConnection = React.useMemo(() => {
        if (!data) return [];
        return data.filter((item: EtlConnectionResponse) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.host.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    const handleDelete = () => {
        if (selectedId !== null){
            deleteConnection.mutate(selectedId);
            handleDeleteClose();
        }
        
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }


    return (
        <Box>
            <Grid2 container spacing={2} alignItems={"center"}>
                <Grid2 size={6}>
                    <Typography variant='h6' fontSize={32} fontWeight={"bold"}>ETL Connection</Typography>
                </Grid2>
                <Grid2 size={6} display={"flex"} justifyContent={"flex-end"}>
                    <Button variant='contained' onClick={handleOpen} startIcon={<Add />}>Add Connection</Button>
                </Grid2>
            </Grid2>

            <TextField
                variant="outlined"
                fullWidth
                placeholder="Search by name or host"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                sx={{ mt: 2 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />


            <Paper elevation={3} sx={{
                mt: 2,
                p: 2,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                minHeight: 200,
            }}>

                {dataConnection && dataConnection.map((item: EtlConnectionResponse) => <Card key={item.id} variant="outlined" sx={{ mr: 2, mb: 2 }}>{InnerCard(item)}</Card>)}
            </Paper>

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description" >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add New ETL Connection
                    </Typography>

                    <Formik
                        initialValues={{
                            name: '',
                            host: '',
                            port: '',
                            database : '',
                            username: '',
                            password: '',
                            db_client: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            console.log(values);
                            resetForm();
                            handleClose();
                            // Add your API call here
                            submitConnection.mutate(values);

                        }}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    name="name"
                                    label="Name"
                                    variant="standard"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    error={touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                />
                                <Field
                                    as={TextField}
                                    name="host"
                                    label="Host"
                                    variant="standard"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    error={touched.host && !!errors.host}
                                    helperText={touched.host && errors.host}
                                />
                                <Field
                                    as={TextField}
                                    name="port"
                                    label="Port"
                                    variant="standard"
                                    type="number"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    error={touched.port && !!errors.port}
                                    helperText={touched.port && errors.port}
                                />
                                <Field
                                    as={TextField}
                                    name="database"
                                    label="Database"
                                    variant="standard"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    error={touched.database && !!errors.database}
                                    helperText={touched.database && errors.database}
                                />
                                <Field
                                    as={TextField}
                                    name="username"
                                    label="Username"
                                    variant="standard"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    error={touched.username && !!errors.username}
                                    helperText={touched.username && errors.username}
                                />
                                <Field
                                    as={TextField}
                                    name="password"
                                    label="Password"
                                    variant="standard"
                                    type="password"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    error={touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                />
                                <Field
                                    as={TextField}
                                    select
                                    name="db_client"
                                    label="DB Client"
                                    variant="standard"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    error={touched.db_client && !!errors.db_client}
                                    helperText={touched.db_client && errors.db_client}
                                >
                                    {/* Example options, replace with your actual options */}
                                    <MenuItem value="mysql">Mysql</MenuItem>
                                    <MenuItem value="mssql">MSSql</MenuItem>
                                    <MenuItem value="postgresql">Postgresql</MenuItem>
                                </Field>
                                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                                    Add Connection
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>

            <Modal open={deleteOpen} onClose={handleDeleteClose} aria-labelledby="delete-modal-title">
                <Box sx={{ ...modalStyle, width: 300 }}>
                    <Typography id="delete-modal-title" variant="h6">
                        Confirm Deletion
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete this connection?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button onClick={handleDeleteClose} sx={{ mr: 1 }}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Toaster position='top-right' />
        </Box>
    );
}
