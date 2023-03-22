import React, { useContext, useState, useEffect } from "react";
import Web3 from "web3";
import { Box, Typography, Grid, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import eivAbi from '../artifacts/contracts/EIVToken.sol/EIVToken.json';
import multisigAbi from '../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json';
import { AccountContext } from "../Contexts/AccountContext";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const useStyles = makeStyles()(theme => ({
	container: {
		marginTop: 120,
		marginBottom: 120
	},
	gridContainer: {
		padding: 10
	},
	balanceText: {
		color: '#b8add2 !important',
		fontWeight: '400 !important',
		fontSize: '15px !important'
	},
	claimBtn: {
		marginTop: '20px !important',
		padding: '5px 20px !important',
		backgroundColor: 'white !important',
		textTransform: 'none !important',
		color: 'black !important',
		fontSize: '18px !important',
		fontWeight: '500 !important',
	},
}));

function Claim()  {
	const { classes } = useStyles();
	const { account } = useContext(AccountContext);

	const [companyBalance, setCompanyBalance] = useState(0);
	const [teamBalance, setTeamBalance] = useState(0);
	const [communityBalance, setCommunityBalance] = useState(0);
	const [advisoryBalance, setAdvisoryBalance] = useState(0);
	const [txs, setTxs] = useState([]);
	const [numConfirmationsRequired, setNumConfirmationsRequired] = useState(0);
	const [multisigContract, setMultiSigContract] = useState(null);

	const CEO_WALLET = process.env.REACT_APP_CEO_WALLET.toLowerCase();
	const CTO_WALLET = process.env.REACT_APP_CTO_WALLET.toLowerCase();
	const AD_WALLET = process.env.REACT_APP_AD_WALLET.toLowerCase();
	const COMPANY_WALLET = process.env.REACT_APP_COMPANY_WALLET.toLowerCase();

	const CLAIM = Web3.utils.keccak256('CLAIM');
	const TEAM = Web3.utils.keccak256('TEAM');
	const ADVISORY = Web3.utils.keccak256('ADVISORY');
	const COMMUNITY = Web3.utils.keccak256('COMMUNITY');

	const DATATYPE = {
		[CLAIM]: 'CLAIM',
		[TEAM]: 'TEAM',
		[ADVISORY]: 'ADVISORY',
		[COMMUNITY]: 'COMMUNITY'
	}

	useEffect(() => {
		const obj = new Web3(window.ethereum); 
		const eivContract = new obj.eth.Contract(eivAbi.abi, process.env.REACT_APP_EIV_CONTRACT);
		const multisigInstance = new obj.eth.Contract(multisigAbi.abi, process.env.REACT_APP_MULTISIG_CONTRACT);
		setMultiSigContract(multisigInstance)
		
		multisigInstance.methods.getTransactions().call().then((result) => {
			setTxs(result);
		});

		multisigInstance.methods.numConfirmationsRequired().call().then((result) => {
			setNumConfirmationsRequired(result)
		})

		eivContract.methods.lockedCompanyBalance().call().then((result) => {
			setCompanyBalance(Web3.utils.fromWei(result));
		});

		eivContract.methods.lockedTeamBalance().call().then((result) => {
			setTeamBalance(Web3.utils.fromWei(result));
		});

		eivContract.methods.lockedAdvisorBalance().call().then((result) => {
			setAdvisoryBalance(Web3.utils.fromWei(result));
		});

		eivContract.methods.lockedCommunityBalance().call().then((result) => {
			setCommunityBalance(Web3.utils.fromWei(result));
		});
	}, [])

	const claim = async() => {
		let data;
		if(account === COMPANY_WALLET) {
			data = CLAIM;
		}
		else if(account === CEO_WALLET ) {
			data = TEAM;
		}
		else if(account === CTO_WALLET) {
			data = ADVISORY;
		}
		else if(account === AD_WALLET) {
			data = COMMUNITY;
		}

		await multisigContract.methods.submitTransaction(data).send({from: account});

		multisigContract.methods.getTransactions().call().then((result) => {
			setTxs(result);
		});
	}

	const confirm = async(index) => {
		const isConfirmed = await multisigContract.methods.isConfirmed(index, account).call();
		if (isConfirmed) {
			alert('You already confirmed for this transaction.');
			return
		}
		try {
			let tx = await multisigContract.methods.confirmTransaction(index).send({from: account});
			const numConfirmations = tx.events.ConfirmTransaction.returnValues.numConfirmations;
		} catch(e) {
			console.log(e)
			alert(e.message)
		}
		multisigContract.methods.getTransactions().call().then((result) => {
			setTxs(result);
		});
	}

	const execute = async(index) => {
		try {
			let tx = await multisigContract.methods.executeTransaction(index).send({from: account});
		} catch(e) {
			console.log(e)
			alert(e.message)
		}
		// await multisigContract.methods.executeTransaction(index).send({from: account})
		multisigContract.methods.getTransactions().call().then((result) => {
			setTxs(result);
		});
	}

	return(
		<Box className={classes.container}>
			<Grid container spacing={3}>
				<Grid className={classes.gridContainer} item lg={3} md={3} sm={12} xs={12}>
					<Typography className={classes.balanceText}>Locked Company Balance: </Typography><p className={classes.balanceText}>{ companyBalance }</p>
				</Grid>
				<Grid className={classes.gridContainer} item lg={3} md={3} sm={12} xs={12}>
					<Typography className={classes.balanceText}>Locked Team Balance: </Typography><p className={classes.balanceText}>{ teamBalance }</p>
				</Grid>
				<Grid className={classes.gridContainer} item lg={3} md={3} sm={12} xs={12}>
					<Typography className={classes.balanceText}>Locked Advisor Balance: </Typography><p className={classes.balanceText}>{ advisoryBalance }</p>
				</Grid>
				<Grid className={classes.gridContainer} item lg={3} md={3} sm={12} xs={12}>
					<Typography className={classes.balanceText}>Locked Community Balance: </Typography><p className={classes.balanceText}>{ communityBalance }</p>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid item lg={12} md={12}>
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Data</TableCell>
									<TableCell>Executed</TableCell>
									<TableCell>From</TableCell>
									<TableCell>Num Confirmations</TableCell>
									<TableCell>Confirm</TableCell>
									{account && COMPANY_WALLET.toLowerCase() == account.toLowerCase() &&
										<TableCell>Execute</TableCell>}
									<TableCell></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{txs.map((row, index) => (
									<TableRow
										key={index}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell>{ DATATYPE[row.data] }</TableCell>
										<TableCell>{ row.executed ? 'True' : 'False' }</TableCell>
										<TableCell>{ row.from }</TableCell>
										<TableCell>{ row.numConfirmations }</TableCell>
										<TableCell>{
											row.from.toLowerCase() !== account.toLowerCase() && !row.executed &&
												<Button variant="outlined" color="primary" onClick={() => confirm(index)}>Confirm</Button> 
										}</TableCell>
										<TableCell>{
											COMPANY_WALLET.toLowerCase() == account.toLowerCase() && !row.executed && row.numConfirmations >= numConfirmationsRequired &&
												<Button variant="outlined" color="primary" onClick={() => execute(index)}>Execute</Button> 
										}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid item lg={12} md={12}>
					<Button onClick={() => claim()} className={classes.claimBtn}>{account === COMPANY_WALLET ? 'Claim Tokens' : ''}
					{account === CEO_WALLET ? 'Claim Team Tokens' : ''}
					{account === CTO_WALLET ? 'Claim Advisor Tokens' : ''}
					{account === AD_WALLET ? 'Claim Community Tokens' : ''}
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
}
export default Claim;