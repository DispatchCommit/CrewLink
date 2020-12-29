import React from 'react';
// @ts-ignore
import chime from '../../../static/chime.mp3';
import { ExtendedAudioElement } from '../Voice';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';

interface TestSpeakersProps {
	speaker: string;
}

const useStyles = makeStyles(() => ({
	button: {
		width: 'fit-content',
		margin: '5px auto',
	},
}));

const TestSpeakersButton: React.FC<TestSpeakersProps> = ({
	speaker,
}: TestSpeakersProps) => {
	const classes = useStyles();

	const audio = new Audio() as ExtendedAudioElement;
  audio.src = chime;
  audio.volume = 0.5;

	const testSpeakers = () => {
		if (speaker.toLowerCase() !== 'default')
		  audio.setSinkId(speaker);

		if ( audio.paused ) {
		  audio.currentTime = 0;
      audio.play();
    } else {
		  audio.pause();
    }
	};

	return (
		<Button
			variant="contained"
			color="secondary"
			size="small"
			className={classes.button}
			onClick={testSpeakers}
		>
      Test Speaker
		</Button>
	);
};

export default TestSpeakersButton;
