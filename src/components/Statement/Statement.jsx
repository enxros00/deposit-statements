import { React, useState , forwardRef } from 'react'
import {
    Box,
    Paper,
    Grid,
    Autocomplete,
    TextField,
    RadioGroup,
    InputLabel,
    Input,
    FormControlLabel,
    Radio,
    Button,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Pagination,
    IconButton,
    FormControl
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Document } from 'react-pdf';
import { Viewer, PdfJs } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import { styled } from "@mui/material/styles";
import { PatternFormat, NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';
import 'dayjs/locale/th';
import apiCallGlobal  from "../../utils/apiCallGlobal"
// import DatePickers from "react-datepicker";
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import 'react-datepicker/dist/react-datepicker.css';
import { HeaderFullRequest } from "../../utils/headers"
import { GetAccount, GetAccountCurrent, GetAccountMock } from '../Account/GetAccount';
import { GetStatements, GetStatementsMock } from '../Statements/GetStatements'; 
import { GetMailingAddress, GetMailingAddressMock } from '../MailingAddress/GetMailingAddress';
import myData from '../../../public/data/testReq.json'
import axios from "axios";

dayjs.extend(buddhistEra)

const CustomizedRadio = styled(Radio)((theme) => ({
    '&.Mui-checked': {
        color: "var(--pumpkin-orange)",
    },
}));

const options = [
    {
        value: 'SDA',
        label_th: 'ออมทรัพย์',
        label_en: 'SA'
    },
    {
        value: 'DDA',
        label_th: 'กระแสรายวัน',
        label_en: 'CA'
    },
    {
        value: 'CDA',
        label_th: 'ฝากประจำ',
        label_en: 'TD'
    }
];

const materialUITextFieldProps = {
    autoComplete: 'off',
    variant: "standard",
    style: {
        width: "100%",
    }
};

function Statement() {
    const [page, setPage] = useState(0);
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [account, setAccount] = useState(options[0])
    const [accountNumber, setAccountNumber] = useState("")
    const [accountNumberDisplay, setAccountNumberDisplay] = useState("")
    const [reqGetAccount, setReqGetAccount] = useState("")
    const [reqGetStatment, setReqGetStatment] = useState("")
    const [resGetAccount, setResGetAccount] = useState("")
    const [resGetStatment, setResGetStatment] = useState("")
    const [resGetMailingAddress, setResGetMailingAddress] = useState("")
    const [language, setLanguage] = useState("TH")
    const [time, setTime] = useState("")
    const [base64, setBase64] = useState("")
    
    let requesetGetAccount = {
        account_id: "",
        account_type: ""
    }

    let requestGetMailingAddress = {
        account_id: "",
        account_type: ""
    }

    let requestGetStatement = {
        account_id: "",
        account_type: "",
        start_date: "",
        end_date: "",
        paging: {},
        language: language
    }

    const handleOnSearch = async () => {
        setResGetAccount("")
        setResGetStatment("")
        setPage(0)
        if( account && accountNumber ){
            if(account.value === "DDA"){
                requesetGetAccount = {
                    account_id: accountNumber
                }
                setReqGetAccount(requesetGetAccount)
                const responseGetAccount = await GetAccountCurrent(requesetGetAccount)
                if(responseGetAccount?.api_status?.api_code === "9000" 
                    && responseGetAccount?.api_status?.api_message === "Success"){
                    setResGetAccount(responseGetAccount.data.account) 
                }
            } else {
                requesetGetAccount = {
                    account_id: accountNumber,
                    account_type: account.value
                }
                setReqGetAccount(requesetGetAccount)
                const responseGetAccount = await GetAccount(requesetGetAccount)
                if(responseGetAccount?.api_status?.api_code === "9000" 
                    && responseGetAccount?.api_status?.api_message === "Success"){
                    setResGetAccount(responseGetAccount.data.account) 
                }
            }    
        }
        if( account && accountNumber && startDate && endDate ){
            requestGetStatement = {
                account_id: accountNumber,
                account_type: account.value,
                start_date: startDate.startOf('month').format('YYYY-MM-DD'),
                end_date: endDate.month() === dayjs().month() 
                    ? dayjs().format('YYYY-MM-DD')
                    : endDate.endOf('month').format('YYYY-MM-DD'),
                language: language
            }
            requestGetMailingAddress = {
                account_id: accountNumber,
                account_type: account.value
            }
            setReqGetStatment(requestGetStatement)
            setTime(dayjs().format('HH:mm:ss'))
            let responseGetStatement = await GetStatements(requestGetStatement)
            if(responseGetStatement?.api_status?.api_code === "9000"
                && responseGetStatement?.api_status?.api_message === "Success"){
                const statements = responseGetStatement.data.account.statements
                while(responseGetStatement.data?.account?.paging?.cursor){
                    requestGetStatement = {
                        ...requestGetStatement,
                        paging: {
                            cursor: responseGetStatement.data?.account?.paging?.cursor,
                            cursor_length: responseGetStatement.data?.account?.paging?.cursor_length
                        }
                    }
                    responseGetStatement = await GetStatements(requestGetStatement)
                    statements.push(...responseGetStatement.data.account.statements)
                }
                responseGetStatement.data.account.statements = statements
                setResGetStatment(responseGetStatement.data.account) 
            }
            let responseGetMailingAddress = await GetMailingAddress(requestGetMailingAddress)
            if(responseGetMailingAddress?.api_status?.api_code === "9000"
                && responseGetMailingAddress?.api_status?.api_message === "Success"){
                const mailingAddress = responseGetMailingAddress.data?.account?.mailing_address
                const resGetMailingAddress = mailingAddress.address1 + " " 
                    + mailingAddress.address2 + " " 
                    + mailingAddress.address3 + " "
                    + mailingAddress.city + " "
                    + mailingAddress.postal_code
                setResGetMailingAddress(resGetMailingAddress) 
            }
        }
    }

    const handlePrint = async () => {
        const header = await HeaderFullRequest()
        let printReq = {
            ...resGetAccount,
            mailing_address: resGetMailingAddress,
            statements: resGetStatment.statements
        }
        // let printReq = {
        //     ...myData
        // }
        const fileAsBase64 = await axios.post(
            "http://localhost:8080/api/print-statementTD",
            JSON.stringify(printReq),
            {
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              }
            }
        )
        .then(async (res) => {
            return res.data;
        })
        .catch((error) => {
            console.log(error);
        })

        setBase64(fileAsBase64)

        var fileURL = base64ToArrayBuffer(fileAsBase64);
        window.open(fileURL);
        // window.open("data:application/pdf;base64," + fileAsBase64,'_blank').focus();
        // window.open(url, '_blank').focus()
    }
    const base64ToArrayBuffer = (base64) => {
        const pdfContentType = 'application/pdf';

        const base64toBlob = (data) => {
            const bytes = window.atob(data);
            let length = bytes.length;
            let out = new Uint8Array(length);
            while (length--) {
                out[length] = bytes.charCodeAt(length);
            }

            return new Blob([out], { type: pdfContentType });
        };

        const url = URL.createObjectURL(base64toBlob(base64));
        return url
    }
    

    const NumericFormatCustom = forwardRef(function NumericFormatCustom(
        props,
        ref,
      ) {
        const { onChange, ...other } = props;

        return (
            <PatternFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                    });
                }}
                format="###-#-######-#"
                mask=" "
                valueIsNumericString
            />
        );
    });

    NumericFormatCustom.propTypes = {
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    const handleOnClear = () => {
        setStartDate("")
        setEndDate("")
        setAccountNumberDisplay("")
        setAccountNumber("")
        setResGetAccount("")
        setResGetStatment("")
    }
      
    const getMinFormatDateTime = () => {
        const date = dayjs().subtract(35, 'month')
        return date;
    }

    const format = (value) => { 
        // console.log(value)
        return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    const columnSA_IM = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
        {
          id: 'population',
          label: 'Population',
          minWidth: 170,
          align: 'right',
          format: (value) => value.toLocaleString('en-US'),
        },
        {
          id: 'size',
          label: 'Size\u00a0(km\u00b2)',
          minWidth: 170,
          align: 'right',
          format: (value) => value.toLocaleString('en-US'),
        },
        {
          id: 'density',
          label: 'Density',
          minWidth: 170,
          align: 'right',
          format: (value) => value.toFixed(2),
        },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangePage2 = (event, newPage) => {
        setPage(newPage-1);
    };
    
    return (
        <div className='main'>
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
                        <Grid className='grid-input-templat' container justifyContent="flex-start" spacing={2}> 
                            <Grid item xs={12} md={2}> 
                            <FormControl >
                                <InputLabel shrink htmlFor="standard">บัญชี</InputLabel>
                                <Autocomplete
                                    value={ account ? options.find(e => e.value === account.value) : '' }
                                    options={options}
                                    getOptionLabel={(option) => 
                                        option.label_th
                                        ? option.label_th  + " / " + option.label_en 
                                        : ""
                                    }
                                    onChange={(event, newValue) => {
                                        setAccount(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                        />
                                    )}
                                />
                            </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}> 
                                <FormControl >
                                    <InputLabel shrink>เลขที่บัญชี</InputLabel>
                                    <PatternFormat
                                        customInput={TextField}
                                        {...materialUITextFieldProps}
                                        value={accountNumber}
                                        onValueChange={(values, sourceInfo) => {
                                            const { formattedValue, value } = values;
                                            setAccountNumberDisplay(formattedValue)
                                            setAccountNumber(value)
                                        }}
                                        format="###-#-#####-#"
                                        mask=" "
                                        valueIsNumericString
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}> 
                            <FormControl >
                                <InputLabel shrink htmlFor="standard">เลือกช่วงเวลาตั้งแต่</InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th" dateLibInstance={dayjs.buddhistEra}>
                                    <DesktopDatePicker 
                                        autoFocus={false}
                                        format={"MMMM YYYY"}
                                        views={['year', 'month']}
                                        value={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        renderInput={(params) => 
                                            <TextField 
                                                {...params} 
                                                error={false} 
                                                variant="standard"
                                            />}
                                        minDate={getMinFormatDateTime()}
                                        maxDate={dayjs(new Date())}
                                    />
                                </LocalizationProvider>
                                </FormControl >
                            </Grid>
                            <Grid item xs={12} md={2}> 
                            <FormControl >
                                <InputLabel shrink htmlFor="standard">ถึง</InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th" dateLibInstance={dayjs.buddhistEra}>
                                    <DesktopDatePicker 
                                        autoFocus={false}
                                        views={['year', 'month']}
                                        format={"MMMM YYYY"}
                                        value={endDate}
                                        onChange={(newvalue) => setEndDate(newvalue)}
                                        renderInput={(params) => <TextField {...params} error={false} variant='standard' />}
                                        minDate={ startDate ? startDate : getMinFormatDateTime()}
                                        maxDate={dayjs(new Date())}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            </Grid>
                            <Grid item xs={12} md={1.3}> 
                            <FormControl >
                                <InputLabel shrink htmlFor="standard">ภาษา</InputLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={language}
                                    onChange={(event) => setLanguage(event.target.value)}
                                >
                                    <FormControlLabel value="TH" control={<CustomizedRadio />} label="TH" />
                                    <FormControlLabel value="EN" control={<CustomizedRadio />} label="EN" />
                                </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={1.3} style={{ alignSelf: "center", justifySelf: "center" }} > 
                                <Button 
                                    variant="outlined" 
                                    className="SecondaryBtn color_font_blue"
                                    style={{ 
                                        width: "100%" ,
                                    }}
                                    onClick={handleOnClear}
                                >
                                    ล้างข้อมูล
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={1.3} style={{ alignSelf: "center", justifySelf: "center" }} > 
                                <Button 
                                    variant="contained"
                                    className="PrimaryBtn"
                                    style={{ width: "100%" }}
                                    onClick={handleOnSearch}
                                >
                                    ค้นหา
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
            <Box mt={2}>
                <Paper elevation={0} 
                    sx={{
                        backgroundColor:'#ecf5fc',
                        borderRadius:'15px',
                        margin:'0 15px',
                        marginTop: "20px"
                    }}
                > 
                    { (resGetStatment && resGetAccount)? ( 
                        <Box p={2}>
                            <Grid container className='grid-templat' justifyContent="flex-start" spacing={2}> 
                                <Grid item xs={6} md={4}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_statement'>
                                            Statement Report :&nbsp;
                                        </span>
                                        <span className='header_statement_1'>รายการเดินบัญชี</span>
                                        &nbsp;
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br/>
                            <Grid container className='grid-templat' justifyContent="flex-start" spacing={2}> 
                                <Grid item xs={6} md={1.4}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_customer_info'>
                                            ชื่อ - นามสกุล <br/> Customer name
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6.1} style={{ alignSelf: "center", justifySelf: "center" }}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_statement_1'>{resGetAccount.title}</span>
                                        &nbsp;
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={1.5}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_customer_info'>
                                            เลขที่บัญชี<br/> Account Number
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={3} style={{ alignSelf: "center", justifySelf: "center" }}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_statement_1'>{accountNumberDisplay}</span>
                                        &nbsp;
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container className='grid-templat' justifyContent="flex-start" spacing={2} > 
                                <Grid item xs={6} md={1.4}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_customer_info'>
                                            ชื่อบัญชี <br/> Account name
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6.1} style={{ alignSelf: "center", justifySelf: "center" }}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_statement_1'>{resGetAccount.title}</span>
                                        &nbsp;
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={1.5}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_customer_info'>
                                            รอบระหว่างวันที่<br/> Period
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={3} style={{ alignSelf: "center", justifySelf: "center" }}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_statement_1'>
                                            {reqGetStatment.start_date} - {reqGetStatment.end_date}
                                            </span>
                                        &nbsp;
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container className='grid-templat' justifyContent="flex-start" spacing={2}>  
                                <Grid item xs={6} md={1.4}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6.1} style={{ alignSelf: "center", justifySelf: "center" }}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_statement_1'>{resGetMailingAddress}</span>
                                        &nbsp;
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={1.5}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_customer_info'>
                                            เวลาออก<br/> Time
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={3} style={{ alignSelf: "center", justifySelf: "center" }}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_statement_1'>
                                            {time}
                                        </span>
                                        &nbsp;
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container className='grid-templat' justifyContent="flex-start" spacing={2}>  
                                <Grid item xs={6} md={1}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_customer_info'>
                                            สาขา <br/> Branch
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6.5} style={{ alignSelf: "center", justifySelf: "center" }}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_statement_1'>{resGetAccount.branch_id} {resGetAccount.branch_name}</span>
                                        &nbsp;
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={1.5}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_customer_info'>
                                            วงเงินเบิกเกินบัญชี<br/> OD Limit
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={3} style={{ alignSelf: "center", justifySelf: "center" }}> 
                                    <Typography
                                        className="fontWeightBold disable_date"
                                    >
                                        <span className='header_statement_1'>
                                            {resGetAccount.balances?.overdraft?.limit}
                                        </span>
                                        &nbsp;
                                    </Typography>
                                </Grid>
                            </Grid>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='table-templat' align="center">วันที่ทำรายการ<br/>Trans Date</TableCell>
                                            <TableCell className='table-templat' align="center">เวลา<br/>Time</TableCell>
                                            <TableCell className='table-templat' align="center">วันที่มีผล<br/>Value Date</TableCell>
                                            <TableCell className='table-templat' align="center">รายการ<br/>T/C</TableCell>
                                            <TableCell className='table-templat' align="center">เลขที่เช็ค<br/>Cheque No.</TableCell>
                                            <TableCell className='table-templat' align="center">ถอน<br/>Withdrawal</TableCell>
                                            <TableCell className='table-templat' align="center">ฝาก<br/>Deposit</TableCell>
                                            <TableCell className='table-templat' align="center">คงเหลือ<br/>Balance</TableCell>
                                            <TableCell className='table-templat' align="center">ผู้ทำรายการ<br/>Teller ID</TableCell>
                                            <TableCell className='table-templat' align="center">ช่องทาง<br/>Chanel</TableCell>
                                            <TableCell className='table-templat' align="center">รายละเอียด<br/>Detail</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {resGetStatment.statements
                                            .slice(page * 25, page * 25 + 25)
                                            .map((row) => (
                                            <TableRow
                                                key={row.deposit_no}
                                            >
                                                <TableCell className='table-templat' align="center">{dayjs(row.original_datetime).format("DD/MM/YYYY")}</TableCell>
                                                <TableCell className='table-templat' align="center">{dayjs(row.original_datetime).format("HH:mm")}</TableCell>
                                                <TableCell className='table-templat' align="center">{dayjs(row.original_datetime).format("DD/MM/YYYY")}</TableCell>
                                                <TableCell className='table-templat' align="center">{row.code}</TableCell>
                                                <TableCell className='table-templat' align="center">{row.cheque_no}</TableCell>
                                                <TableCell className='table-templat' align="right">{row.debit_amount === 0 ? "" :  format(row.debit_amount)}</TableCell>
                                                <TableCell className='table-templat' align="right">{row.credit_amount === 0 ? "" :  format(row.credit_amount)}</TableCell>
                                                <TableCell className='table-templat' align="right">{row.balance === 0 ? "" :  format(row.balance)}</TableCell>
                                                <TableCell className='table-templat' align="center">{row.teller_id}</TableCell>
                                                <TableCell className='table-templat' align="center">{row.channel}</TableCell>
                                                <TableCell className='table-templat' align="left">{row.description1}</TableCell>                        
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[]}
                                    component="div"
                                    count={resGetStatment.statements.length}
                                    rowsPerPage={25}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    backIconButtonProps={{
                                        style: {display: "none" },
                                    }}
                                    nextIconButtonProps={{
                                        style: {display: "none" },
                                    }}
                                    labelDisplayedRows={({ count, page }) => {
                                        return <Pagination 
                                            page={page+1} 
                                            count={Math.ceil(resGetStatment.statements.length / 25)} 
                                            onChange={handleChangePage2} 
                                            color="primary"
                                            shape="rounded"
                                        />
                                    }}
                                />
                            </TableContainer>
                            <Button 
                                variant="contained"
                                className="PrimaryBtn"
                                style={{ width: "100%" }}
                                onClick={handlePrint}
                            >
                                ค้นหา
                            </Button>
                        </Box>
                    ) : ( <div /> )}
                </Paper>
            </Box>
        </div>
    )
}

export default Statement