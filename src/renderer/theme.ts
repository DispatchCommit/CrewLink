import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { orange, blue } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: orange,
		secondary: blue,
		background: {
			default: '#27232a',
			paper: '#272727',
		},
		type: 'dark',
	},
	overrides: {
		MuiTooltip: {
			tooltip: {
				fontSize: 16,
			},
		},
	},
});

export default theme;
