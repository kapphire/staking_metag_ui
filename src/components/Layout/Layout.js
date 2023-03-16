import React from "react"
import Header from "./Header/Header"
import Footer from "./Footer/Footer"
import { Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(theme => ({
  layout: {
		maxWidth: 1200,
		marginLeft: 'auto',
		marginRight: 'auto'
	},
}));

function  Layout(props) {
	const { classes } = useStyles();

	return (
		<Box className={classes.layout}>
			<Header />
			<main>{props.children}</main>
			<Footer />
		</Box>
	)
}
export default Layout;