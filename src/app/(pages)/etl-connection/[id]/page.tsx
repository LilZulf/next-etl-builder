"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getEtlConnection } from '@/app/api/services'
import EtlConnectionResponse from '../response-interface'
import { Paper, Box, CircularProgress, Grid2, Typography, Button, IconButton } from '@mui/material'
import { Edit, ArrowBack } from '@mui/icons-material'
import { Form, Formik, Field } from 'formik'
import * as Yup from 'yup';
import { databases } from '@/app/constant'

export default function ConnectionDetails() {
  const id = usePathname().split("/").pop();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["etl-connection-by-id", id],
    queryFn: () => getEtlConnection(id),
  })
  const [isEdit, setIsEdit] = React.useState(false);

  const dataConnection: EtlConnectionResponse = React.useMemo(() => data, [data]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    database: Yup.string().required('Database is required'),
    host: Yup.string().required('Host is required'),
    username: Yup.string().required('Username is required'),
    port: Yup.number().required('Port is required'),
    password: Yup.string().required('Password is required'),
    db_client: Yup.string().required('DB Client is required'),
  });

  const handleIsEdit = () => {
    setIsEdit(val => !val);
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
        <Grid2 size={{ xs: 12, md: 0.5 }}>
          <IconButton onClick={() => { window.history.back() }}><ArrowBack /></IconButton>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 5.5 }}>
          <Typography variant='h5' fontSize={32} fontWeight={"bold"}>{dataConnection?.name} Connection Details</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }} display={"flex"} justifyContent={"flex-end"}>
          <Button variant='contained' onClick={handleIsEdit} startIcon={<Edit />}>Edit Connection</Button>
        </Grid2>
      </Grid2>

      <Paper
        elevation={3}
        sx={{
          mt: 2,
          p: 2,
          minHeight: 200,
        }}
      >
        <Grid2 container spacing={2} alignItems={"center"}>
          <Grid2 size={12}>
            <Grid2 container spacing={2} alignItems={"center"}>
              <Grid2 size={6}>
                <img
                  src={databases.find((item) => item.value === dataConnection?.db_client.toLowerCase())?.img}
                  style={{ width: "20%" }} />
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <Typography variant='subtitle1' fontWeight={"bold"}>Name</Typography>
            <Typography variant='body1'>{dataConnection?.name}</Typography>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <Typography variant='subtitle1' fontWeight={"bold"}>Host</Typography>
            <Typography variant='body1'>{dataConnection?.host}</Typography>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <Typography variant='subtitle1' fontWeight={"bold"}>Port</Typography>
            <Typography variant='body1'>{dataConnection?.port}</Typography>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <Typography variant='subtitle1' fontWeight={"bold"}>Database</Typography>
            <Typography variant='body1'>{dataConnection?.database}</Typography>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <Typography variant='subtitle1' fontWeight={"bold"}>Username</Typography>
            <Typography variant='body1'>{dataConnection?.username}</Typography>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <Typography variant='subtitle1' fontWeight={"bold"}>Password</Typography>
            <Typography variant='body1'>{dataConnection?.password}</Typography>
          </Grid2>
        </Grid2>
      </Paper>

    </Box>
  )
}
