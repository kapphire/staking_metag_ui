import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import logo from '../../../MetaGamZ-Logo_Horizon.png';
import { makeStyles } from 'tss-react/mui';
import Web3 from "web3";
import { useHistory } from "react-router-dom";
import { AccountContext } from "../../../Contexts/AccountContext";

const useStyles = makeStyles()(theme => ({
  container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		margin: 35
	},
	navigationContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	navigationItem: {
		color: 'white',
		fontWeight: '700 !important',
		fontSize: '16px !important',
		paddingRight: 15,
		paddingLeft: 15,
		cursor: 'pointer'
	},
	navigationItemOutlined: {
		color: 'white',
		fontWeight: '700 !important',
		fontSize: '16px !important',
		paddingRight: 15,
		paddingLeft: 15,
		cursor: 'pointer',
		border: '1px solid #FFFFFF',
		borderRadius: 12,
		padding: 20,
		marginRight: '15px !important'
	},
	navigationItemOutlinedWrong: {
		color: 'white',
		fontWeight: '700 !important',
		fontSize: '16px !important',
		paddingRight: 15,
		paddingLeft: 15,
		cursor: 'pointer',
		border: '1px solid #FFFFFF',
		borderRadius: 12,
		padding: 20,
		marginRight: '15px !important',
		backgroundColor: 'red !important'
	},
	button: {
		backgroundColor: 'white !important',
		borderRadius: '25px 0px 0px 25px !important',
		padding: '10px !important'
	},
	buttonText: {
		fontWeight: 600,
		color: 'black'
	},
	iconButton: {
		backgroundColor: '#de5d66! important',
		borderRadius: '0px !important',
		width: '30px !important',
		height: '46px !important',
		color: 'white !important'
	},
	logoImage: {
		width: 230,
		cursor: 'pointer'
	}
}));

function Header()  {
	const { classes } = useStyles();
	const { setAccount } = useContext(AccountContext);
	const history = useHistory();
	const [address, setAddress] = useState();
	const [web3Obj, setWeb3Obj] = useState();
	const [isCorrectNet, setCorrectNet] = useState(false);
	const chainId = parseInt(process.env.REACT_APP_AVAX_CHAIN_ID); // Avalache network ChainId
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const approvers = [
		process.env.REACT_APP_CEO_WALLET.toLowerCase(),
		process.env.REACT_APP_CTO_WALLET.toLowerCase(),
		process.env.REACT_APP_AD_WALLET.toLowerCase(),
		process.env.REACT_APP_COMPANY_WALLET.toLowerCase()
	];
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		if(localStorage.getItem('address')) {
			setAddress(localStorage.getItem('address'));
			setAccount(localStorage.getItem('address'))
			const obj = new Web3(window.ethereum);
			setWeb3Obj(obj);
			obj.eth.getChainId().then(res => {
				if(res === chainId) setCorrectNet(true) }
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if(web3Obj) {
			window.ethereum.on('networkChanged', function(networkId) {
				if(parseInt(networkId) === chainId) {
					setCorrectNet(true);
				}
				else {
					setCorrectNet(false);
				}
			});

			window.ethereum.on('accountsChanged', function (accounts) {
				if(accounts.length === 0 && localStorage.getItem('address')) {
					logout();
				}
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [web3Obj]);

	const connectMetaMask = async () => {
		if (window.ethereum) {
			const obj = new Web3(window.ethereum);
			setWeb3Obj(obj);
			try {
				await window.ethereum.enable();
			} catch (error) { console.log(error);}

			window.ethereum
				.request({ method: 'eth_accounts' })
				.then(async (res) => {
					if(res.length !== 0) {
						localStorage.setItem('address', res[0]);
						setAddress(res[0])
						setAccount(res[0])
						obj.eth.getChainId().then(res => {
							if(res === chainId) setCorrectNet(true) }
						)
					}
				})
				.catch(console.error);
		}
		else if (window.web3) {
			const obj = window.web3;
			setWeb3Obj(obj);
		} else {}
	}
	
	const shortenAddress = address => address && address.length > 0 ? `${address.slice(0, 6)}...${address.substr(address.length - 4)}` : '';

	const logout = () => {
		handleClose();
		localStorage.removeItem('address');
		setAddress(null);
		setAccount(null);
		setWeb3Obj(null);
	}

	return(
		<header className={classes.container}>
			<Box>
				<img src={logo} alt={logo} className={classes.logoImage} onClick={() => history.push('/')} />
			</Box>
			<Box className={classes.navigationContainer}>
				{approvers.includes(address) && <Typography className={classes.navigationItem} onClick={() => history.push('/claim')}>Claim</Typography>}
				{/* <Typography className={classes.navigationItem}>METAGEarn</Typography>
				<Typography className={classes.navigationItem}>METAGPlay</Typography>
				<Typography className={classes.navigationItem}>METAGLock</Typography>
				<Typography className={classes.navigationItem}>Whitepaper</Typography>
				<Typography className={classes.navigationItem}>FAQ</Typography> */}
				{address && <Typography className={isCorrectNet ? classes.navigationItemOutlined : classes.navigationItemOutlinedWrong }>{isCorrectNet ? 'AVAX Network' : 'Wrong Network'}</Typography>}
				<Button className={classes.button} onClick={() => connectMetaMask()}><b className={classes.buttonText}>{address ? shortenAddress(address) : 'CONNECT WALLET'}</b></Button>
				<IconButton className={classes.iconButton} onClick={(event) => {
					if(address) handleClick(event);
					else connectMetaMask();
				}}><ArrowDropDownIcon /></IconButton>
				<Menu
					id="basic-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
				>
					{address && <MenuItem onClick={() => logout()}>Log out</MenuItem>}
				</Menu>
			</Box>
		</header>
	);
}
export default Header;