import React, { useContext, useState } from "react";
import { Box, Typography, Grid, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import MetaGamZLogo from '../MetaGamZ-Logo.png';
import StakeDialog from '../components/Home/StakeDialog';
import { useHistory } from "react-router-dom";
import stakingAbi from '../artifacts/contracts/MetagStakepool.sol/MetagStakepool.json';
import metagAbi from '../artifacts/contracts/ERC20Interface.sol/ERC20Interface.json';
import Web3 from "web3";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { AccountContext } from "../Contexts/AccountContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles()(theme => ({
	container: {
		marginTop: 120,
		marginBottom: 120
	},
	gridContainer: {
		padding: 10
	},
  upperBox: {
		cursor: 'pointer',
		border: '2px solid #FFF',
		borderRadius: 20,
		margin: 10,
		padding: 40,
		display: 'flex',
		justifyContent: 'space-between',
		paddingRight: 100
	},
	downBox: {
		cursor: 'pointer',
		border: '2px solid #FFF',
		borderRadius: 20,
		margin: 10,
		padding: 30,
		height: 80,
		display: 'grid',
		alignContent: 'space-between'
	},
	downBoxFirst: {
		cursor: 'pointer',
		border: '2px solid #FFF',
		borderRadius: 20,
		margin: 10,
		paddingLeft: 30,
		paddingRight: 30,
		paddingTop: 15,
		paddingBottom: 15,
		height: 110,
		display: 'grid',
		alignContent: 'space-between'
	},
	img: {
		width: 40
	},
	logoTitle: {
		color: '#f4eeff !important',
		fontSize: '16px !important',
		fontWeight: '600 !important',
		marginTop: 10
	},
	logoText: {
		color: '#b8add2 !important',
		fontWeight: '400 !important',
		fontSize: '15px !important'
	},
	logoTableHeader: {
		color: 'white !important',
		fontWeight: '400 !important',
		fontSize: '15px !important'
	},
	logoTableText: {
		color: 'white !important',
		fontSize: '18px !important',
		fontWeight: '600 !important'
	},
	downText: {
		color: 'white',
		fontSize: '18px !important',
		fontWeight: '600 !important'
	},
	downValue: {
		fontSize: '24px !important',
		color: '#FFFFFF !important'
	},
	collectBtn: {
		padding: '5px 20px !important',
		backgroundColor: 'white !important',
		textTransform: 'none !important',
		color: 'black !important',
		fontSize: '18px !important',
		fontWeight: '500 !important',
	},
	collectBox: {
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
	stakeBox: {
		display: 'flex',
		justifyContent: 'space-around',
		textAlign: 'center'
	},
	stakeLabel: {
		color: 'white',
		fontSize: '18px !important',
		fontWeight: '600 !important',
		marginBottom: '15px !important'
	},
	depositContainer: {
		display: 'flex',
		justifyContent: 'end',
		padding: 24
	}
}));

function Home()  {
	const { classes } = useStyles();
	const [isEnablePool, setEnablePool] = useState(false);
	const [staked, setStaked] = useState(0);
	const [reward, setReward] = useState(0);
	const [pendingReward, setPendingReward] = useState(0);
	const [stakingContract, setStakingContract] = useState(null);
	const [metagContract, setMetagContract] = useState(null);
	const [metagBalance, setMetagBalance] = useState(0);
	const [tokenSupply, setTokenSupply] = useState(0);
	const [apy, setApy] = useState(0);
	const [openAlert, setOpenAlert] = React.useState(false);
	const [message, setMessage] = React.useState('');
	const [isSuccess, setSuccess] = React.useState(true);

	const stakingContractAddress = process.env.REACT_APP_STAKING_CONTRACT_ADDRESS;
	const metagContractAddress = process.env.REACT_APP_METAG_CONTRACT_ADDRESS;
	const chainId = parseInt(process.env.REACT_APP_AVAX_CHAIN_ID);
	const history = useHistory();

	const { account } = useContext(AccountContext);

	React.useEffect(() => {
		if(!window.ethereum) { history.push('/install-metamask');}
		else {
			const obj = new Web3(window.ethereum); 
			const stakingInstance = new obj.eth.Contract(stakingAbi.abi, stakingContractAddress);
			
			stakingInstance.methods.apy().call().then((res) => {
				setApy(res);
			});
			stakingInstance.methods.totalStaked().call().then((res) => {
				setTokenSupply(Web3.utils.fromWei(res));
			});

			if(account) {
				obj.eth.getChainId().then(res => 
					{
						if(res === chainId) {
							const stakingInstance = new obj.eth.Contract(stakingAbi.abi, stakingContractAddress);
							const metagInstance = new obj.eth.Contract(metagAbi.abi, metagContractAddress);
							setStakingContract(stakingInstance);
							setMetagContract(metagInstance);
							stakingInstance.methods.balanceOf(account).call().then((res) => {
								setStaked(Web3.utils.fromWei(res))
							});
							stakingInstance.methods.rewardsOf(account).call().then((res) => {
								setReward(Web3.utils.fromWei(res));
							});
							stakingInstance.methods.pendingRewardsOf(account).call().then((res) => {
								setPendingReward(Web3.utils.fromWei(res))
							});
							metagInstance.methods.balanceOf(account).call().then((res) => {
								setMetagBalance(Web3.utils.fromWei(res))
							})
							metagInstance.methods.allowance(account, stakingContractAddress).call().then((res) => {
								if(parseFloat(res) === 0) {
									setEnablePool(false);
								} else {
									setEnablePool(true);
								}
							});
						}
					}
				)
			}
			else {
				setStaked(0)
				setReward(0);
				setPendingReward(0)
				setMetagBalance(0)
			}
		}
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account]);

	const handleCloseAlert = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
	
		setOpenAlert(false);
	  };

	const deposit = () => {
		const amount = Web3.utils.toWei(process.env.REACT_APP_DEPOSIT_AMOUNT);
		stakingContract.methods.depositTokens(amount).send({from: account}).then((result) => {
			setMessage('Successfully deposited.');
			setSuccess(true);
			setOpenAlert(true);
			// stakingContract.methods.tokenSupply().call().then((res) => {
			// 	setTokenSupply(Web3.utils.fromWei(res));
			// 	setMessage('Successfully deposited.');
			// 	setSuccess(true);
			// 	setOpenAlert(true);
			// }).catch((e) => {
			// 	setMessage('Something goes wrong.');
			// 	setSuccess(false);
			// 	setOpenAlert(true);
			// });
		}).catch((e) => {
			setMessage('Something goes wrong.');
			setSuccess(false);
			setOpenAlert(true);
		});
	}

	const enablePool = () => {
		if(account) {
			const amount = Web3.utils.toWei('100000000000');
			metagContract.methods.approve(stakingContractAddress, amount).send({from: account}).then((res) => {
				setEnablePool(true);
			});
		}
	}

	const claim = () => {
		stakingContract.methods.claimReward().send({from: account}).then((result) => {
			stakingContract.methods.rewardsOf(account).call().then((res) => {
				setReward(Web3.utils.fromWei(res));
				setMessage('Successfully claimed.');
				setSuccess(true);
				setOpenAlert(true);
			}).catch((e) => {
				setMessage('Something goes wrong.');
				setSuccess(false);
				setOpenAlert(true);
			});
		});
	}

	return(
		<Box className={classes.container}>
			<Grid container spacing={3}>
				<Grid className={classes.gridContainer} item lg={12} md={12} sm={12} xs={12}>
					<Box className={classes.upperBox}>
						<Box>
							<img className={classes.img} src={MetaGamZLogo} alt={MetaGamZLogo} />
							<Typography className={classes.logoTitle}>MetagamZ</Typography>
							<Typography className={classes.logoText}>Stake MetaG Earn MetaG</Typography>
						</Box>
						<Box>
							<Typography className={classes.logoTableHeader}>MetaG Earned</Typography>
							<Typography className={classes.logoTableText}>{(parseFloat(reward) + parseFloat(pendingReward)).toFixed(5)}</Typography>
						</Box>
						<Box>
							<Typography className={classes.logoTableHeader}>MetaG Staked</Typography>
							<Typography className={classes.logoTableText}>{parseFloat(staked).toFixed(5)}</Typography>
						</Box>
						<Box>
							<Typography className={classes.logoTableHeader}>APY</Typography>
							<Typography className={classes.logoTableText}>{apy} %</Typography>
						</Box>
						<Box>
							<Typography className={classes.logoTableHeader}>Total Staked</Typography>
							<Typography className={classes.logoTableText}>{parseFloat(tokenSupply).toFixed(5)}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid className={classes.gridContainer} item lg={4} md={4} sm={12} xs={12}>
					<Box className={classes.downBox}>
						<Typography className={classes.downText}>Chain: Avax</Typography>					
						<Typography className={classes.downText}>View Project Site</Typography>					
						<Typography className={classes.downText}>Buy MetaG</Typography>					
					</Box>
				</Grid>
				<Grid className={classes.gridContainer} item lg={4} md={4} sm={12} xs={12}>
					<Box className={classes.downBox}>
						<Typography className={classes.downText}>MetaG Earned</Typography>	
						<Box className={classes.collectBox}>
							<Typography className={classes.downValue}>{(parseFloat(reward) + parseFloat(pendingReward)).toFixed(5)}</Typography>						
							{account && <Button className={classes.collectBtn} onClick={claim}>Collect</Button>}
						</Box>				
					</Box>
				</Grid>
				<Grid className={classes.gridContainer} item lg={4} md={4} sm={12} xs={12}>
					<Box className={classes.downBox}>
						{isEnablePool ? 
						<Box className={classes.stakeBox}>
							<Box>
								<Typography className={classes.stakeLabel}>Stake</Typography>		
								<StakeDialog 
									isStake={true}
									staked={staked}
									metagBalance={metagBalance}
									setMessage={setMessage}
									setOpenAlert={setOpenAlert}
									setSuccess={setSuccess}
									setStaked={setStaked}
									setTokenSupply={setTokenSupply}
									stakingContract={stakingContract}
									address={account}
								/>
							</Box>
							<Box>
								<Typography className={classes.stakeLabel}>Unstake</Typography>		
								<StakeDialog 
									isStake={false}
									staked={staked}
									metagBalance={metagBalance}
									setMessage={setMessage}
									setOpenAlert={setOpenAlert}
									setSuccess={setSuccess}
									setStaked={setStaked}
									setTokenSupply={setTokenSupply}
									stakingContract={stakingContract}
									address={account}
								/>
							</Box>
						</Box>
						:
						<React.Fragment>
							<Typography className={classes.downText}>Start Staking</Typography>		
							{account && <Button className={classes.enableBtn} onClick={() => enablePool()}>Enable Pool</Button>}
						</React.Fragment>
						}
					</Box>
				</Grid>
			</Grid>
			{
				process.env.REACT_APP_STAKING_WALLET === account && <Box className={classes.depositContainer}>
					<Button className={classes.collectBtn} onClick={deposit}>Deposit</Button>
				</Box>
			}
			<Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={isSuccess ? "success" : "error"} sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
		</Box>
	);
}
export default Home;