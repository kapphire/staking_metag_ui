import React from "react";
import logo from '../../../MetaGamZ-Logo_Horizon.png';
import telegram from '../../../telegram.svg';
import twitter from '../../../twitter.svg';
import medium from '../../../medium.svg';
import { Box, Typography } from '@mui/material';

import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(theme => ({
  container: {
		display: 'block',
		alignItems: 'center',
		justifyContent: 'space-between',
		margin: 35
	},
	upperContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%'
	},
	text: {
		color: 'white'
	},
	iconContainer: {
		marginLeft: 10
	},
	downContainer: {
		textAlign: 'center'
	},
	logoImage: {
		width: 230,
		height: 38
	}
}));

function Footer()  {
	const { classes } = useStyles();

	return(
		<footer className={classes.container}>
			<Box className={classes.upperContainer}>
				<img src={logo} alt={logo} className={classes.logoImage} />
				<Box>
					<Typography className={classes.text}>Follow us on</Typography>
					<Box className={classes.iconContainer}>
						<img src={telegram} alt={telegram} />
						<img src={twitter} alt={twitter} />
						<img src={medium} alt={medium} />
					</Box>
				</Box>
			</Box>
			<Box className={classes.downContainer}>
				<Typography className={classes.text}>Contact: info@metagamz.io</Typography>
				<Typography className={classes.text}>© 2022 METAG. All rights reserved.</Typography>
			</Box>
		</footer>
	);
}
export default Footer;