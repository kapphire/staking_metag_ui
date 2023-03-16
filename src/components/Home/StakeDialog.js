import React from "react";
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    Typography,
    LinearProgress,
    IconButton
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import MetaGamZLogo from '../../MetaGamZ-Logo.png';
import CloseIcon from '@mui/icons-material/Close';
import Web3 from "web3";

const useStyles = makeStyles()(theme => ({
    dialogTitle: {
        backgroundColor: '#3d4552 !important',
        color: '#fff7f7',
        fontWeight: 700
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
	enableBtn: {
		padding: '5px 20px !important',
		backgroundColor: 'white !important',
		textTransform: 'none !important',
		color: 'black !important',
		fontSize: '18px !important',
		fontWeight: '500 !important',
		width: '100% !important'
    },
    logoImg: {
        width: 30
    },
    dialogContent: {
        backgroundColor: '#636f81 !important'
    },
    input: {
        padding: 20,
        textAlign: 'right',
        width: '100%',
        marginLeft: -40,
        '&:focus': {
            outline: 'none'
        }
    },
    textContainer: {
        borderRadius: 15,
        overflow: 'hidden'
    },
    percentButton: {
        color: 'black !important',
        backgroundColor: 'white !important',
        borderRadius: '10px !important',
        width: 130,
        margin: '5px !important',
        fontWeight: '700 !important'
    },
    dialogPaper: {
        maxWidth: '100% !important'
    },
    confirmButton: {
        color: 'black !important',
        backgroundColor: 'white !important',
        borderRadius: '10px !important',
        width: 130,
        height: '20px !important',
        textTransform: 'none !important',
        fontWeight: '700 !important'
    },
    logoContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        marginTop: 15
    },
    balanceContainer: {
        display: 'flex',
        justifyContent: 'end',
        marginBottom: 20,
        marginTop: 20
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 20
    },
    confirmContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    balance: {
        color: 'white !important'
    },
    stakeLabel: {
        color: 'white !important'
    },
    icon: {
        color: 'white !important'
    },
    titleText: {
        fontWeight: '700 !important',
        fontSize: '22px !important'
    }
}));

export default function StakeDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [value, setValue] = React.useState(0);
    const { classes } = useStyles();
    const { isStake, staked, metagBalance, setMessage, setOpenAlert, setSuccess, setStaked, setTokenSupply, stakingContract, address } = props;
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const handleConfirm = () => {
        const amount = Web3.utils.toWei(value.toString());
        if(isStake) {
            stakingContract.methods.stake(amount).send({from: address}).then((res) => {
                stakingContract.methods.balanceOf(address).call().then((r) => {
                    setStaked(Web3.utils.fromWei(r))
                });
                stakingContract.methods.totalStaked().call().then((res) => {
                    setTokenSupply(Web3.utils.fromWei(res));
                });
                setMessage('Successfully staked.');
                setSuccess(true);
                setOpenAlert(true);
                setOpen(false);
            }).catch((e) => {
                setMessage('Something goes wrong.');
                setSuccess(false);
                setOpenAlert(true);
                setOpen(false);
            });
        } else {
            stakingContract.methods.withdraw(amount).send({from: address}).then((res) => {
                stakingContract.methods.balanceOf(address).call().then((r) => {
                    setStaked(Web3.utils.fromWei(r))
                });
                stakingContract.methods.totalStaked().call().then((res) => {
                    setTokenSupply(Web3.utils.fromWei(res));
                });
                setMessage('Successfully unstaked.');
                setSuccess(true);
                setOpenAlert(true);
                setOpen(false);
            }).catch((e) => {
                setMessage('Something goes wrong.');
                setSuccess(false);
                setOpenAlert(true);
                setOpen(false);
            });
        }
        
    }
  
    return (
      <div>
        {address &&<Button variant="outlined" onClick={handleClickOpen} className={classes.enableBtn}>
          {isStake ? '+' : '-'}
        </Button>}
        <Dialog
          onClose={handleClose}
          open={open}
          PaperProps={{ classes: {root: classes.dialogPaper } }}
        >
          <DialogTitle className={classes.dialogTitle}>
            <Box className={classes.titleContainer}>
                <Typography className={classes.titleText}>{isStake ? 'Stake' : 'Unstake'}</Typography>
                <IconButton onClick={handleClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
              <Box className={classes.logoContainer}>
                  <Typography className={classes.stakeLabel}>{isStake ? 'Stake' : 'Unstake'}:</Typography>
                  <img src={MetaGamZLogo} alt={MetaGamZLogo} className={classes.logoImg} />
              </Box>
              <Box className={classes.textContainer}>
                  <input type="number" variant="outlined" className={classes.input} value={value} onChange={(e) => {
                        if(isStake) {
                            if(parseFloat(e.target.value) <= metagBalance) setValue(e.target.value)
                        } else {
                            if(parseFloat(e.target.value) <= staked) setValue(e.target.value)
                        }
                    }}  min={0} max={isStake ? metagBalance : staked}/>
              </Box>
              <Box className={classes.balanceContainer}>
                  <Typography className={classes.balance}>Balance: {isStake ? parseFloat(metagBalance).toFixed(4) : parseFloat(staked)}</Typography>
              </Box>
              <Box>
                  <LinearProgress variant="determinate" value={progress}/>
              </Box>
              <Box className={classes.buttonContainer}>
                  <Button className={classes.percentButton} onClick={() => {setProgress(25); setValue((isStake ? metagBalance : staked) * 0.25);}}>25%</Button>
                  <Button className={classes.percentButton} onClick={() => {setProgress(50); setValue((isStake ? metagBalance : staked) * 0.5);}}>50%</Button>
                  <Button className={classes.percentButton} onClick={() => {setProgress(75); setValue((isStake ? metagBalance : staked) * 0.75);}}>75%</Button>
                  <Button className={classes.percentButton} onClick={() => {setProgress(100); setValue((isStake ? metagBalance : staked));}}>100%</Button>
              </Box>
              <Box className={classes.confirmContainer}>
                  <Button className={classes.confirmButton} onClick={handleConfirm}>Confirm</Button>
              </Box>
          </DialogContent>
        </Dialog>
      </div>
    );
  }