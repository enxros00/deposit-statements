import React from 'react'

import {
    Box,
    Container,
    Grid,
    Paper,
    Typography
} from '@mui/material'

function OnboardDipChip() {
  return (
    <div className='main'>
        <Box
            mx={-3}
            pb={2}
            style={{ borderBottom: "3px solid var(--primary)" }}
            className='container_section2'
        >
            <Container maxWidth="xl">
                <Grid container direction="row">
                    <Grid item xs={6} style={{ alignSelf: "center" }}>
                        <Typography
                            variant="h6"
                            style={{ color: "var(--primary)", fontWeight: "bold" }}
                        >
                            ค้นหาข้อมูล
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{ alignSelf: "center" }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <Box
                                style={{ display: "flex", alignItems: "center" }}
                            ></Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
        <Box mt={1}>
            <Grid container alignItems="center" justifyContent="center"> </Grid>
        </Box>
        <Box mt={2}>
            <Paper elevation={0} 
                sx={{
                    backgroundColor:'var(--carolina-blue-light)',
                    borderRadius:'15px',
                    margin:'0 15px'
                }}
            >
                <Box p={2}>
                    <Grid className='grid-templat' container justifyContent="flex-start" spacing={2}> 
                        <Grid item xs={12} md={2}> 
                            <Typography className="fontWeightBold disable_date" >
                                <span className='header_statement'>
                                    ค้นหาข้อมูลลูกค้า
                                </span>
                            </Typography>
                        </Grid>
                    </Grid>
                    <br/>
                    <Grid className='grid-templat' container justifyContent="flex-start" spacing={2}> 
                    
                    </Grid>
                </Box>
            </Paper>
        </Box>
    </div>
  )
}

export default OnboardDipChip