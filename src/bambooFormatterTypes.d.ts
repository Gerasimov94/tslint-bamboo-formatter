export interface IFailure {
	title: string;
	fullTitle: string;
	duration: number;
	errorCount: number;
	error: string;
}

export interface IOutputFile {
	stats: {
		tests: number;
		passes: number;
		failures: number;
		duration: number;
		start: Date;
		end: Date;
	};
	failures: Array<IFailure>;
	passes: Array<{
		title: string;
		fullTitle: string;
		duration: number;
		errorCount: number;
	}>;
	skipped: Array<{}>;
}
