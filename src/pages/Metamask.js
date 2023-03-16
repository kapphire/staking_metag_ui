import React from "react";
import { Box, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(theme => ({
	container: {
		marginTop: 250,
        marginBottom: 250,
        textAlign: 'center'
    },
    installText: {
        color: 'white !important',
        fontSize: '40px !important',
        fontWeight: '700 !important'
    },
    link: {
        color: 'white'
    }
}));

function Metamask()  {
	const { classes } = useStyles();

	return(
		<Box className={classes.container}>
			<Typography className={classes.installText}>Please install Metamask!</Typography>
            <a className={classes.link} target="_blank" rel="noopener noreferrer" href="https://metamask.io/download/">Install metamask</a>
		</Box>
	);
}
export default Metamask;