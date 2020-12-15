
export interface ISettings {
	alwaysOnTop: boolean;
	microphone: string;
	speaker: string;
	pushToTalk: boolean;
	serverURL: string;
	pushToTalkShortcut: string;
	muteShortcut: string;
	deafenShortcut: string;
	offsets: {
		version: string;
		data: string;
	},
	hideCode: boolean;
	enableSpatialAudio: boolean;
}
