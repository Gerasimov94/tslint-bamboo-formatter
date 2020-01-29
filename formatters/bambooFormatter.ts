import * as Lint from "tslint";
import * as fs from 'fs';
import * as path from 'path';
import {IOutputFile, IFailure} from './bambooFormatterTypes';

const outputFileName = 'tslint-results.json'
const silent = false;

class IssueGroup {
	public failures: Lint.RuleFailure[] = [];
  
	constructor(public issue: Lint.RuleFailure) {
	  this.failures = [issue];
	}
  
	public set add(failure: Lint.RuleFailure) {
	  this.failures.push(failure);
	}

	public get getFaltures() {
		return this.failures;
	}
}

export class Formatter extends Lint.Formatters.AbstractFormatter {
	static metadata: Lint.IFormatterMetadata = {
		formatterName: 'tslint-bamboo-formatter',
		description: 'Formats errors as bamboo compatible JSON.',
		sample: '',
		consumer: 'human'
	};

    public format(failures: Lint.RuleFailure[]): string {
		const errors = failures.filter(falture => falture.getRuleSeverity() === 'error');

		let output: IOutputFile = {
			stats: {
				tests: 0,
				passes: 0,
				failures: errors.length,
				duration: 0,
				start: new global.Date(),
				end: new global.Date(),
			},
			failures: [],
			passes: [],
			skipped: [],
		};

		const failuresJSON = errors.reduce((memo: {[key: string]: IssueGroup}, failure: Lint.RuleFailure) => {
			let issueGroup = memo[failure.getFileName()];

			if (issueGroup) {
					issueGroup.add = failure;
			} else {
				memo = {
					...memo,
					[failure.getFileName()]: new IssueGroup(failure)
				}
			}

			return memo;
		}, {});

		output.failures = Object.values(failuresJSON).reduce((memo: IFailure[], item: IssueGroup) => memo = ([
			...memo,
			...item.getFaltures.map((failure: Lint.RuleFailure) => {
				const fileName = (failure.getFileName() || '').match('(?<=/)[^/]+$');

				return ({
					title: fileName ? fileName[0] : '',
					fullTitle: path.resolve(failure.getFileName()),
					duration: 0,
					errorCount: errors.length,
					error: failure.getFailure(),
				});
			}),
		]), []);

		const stringifiedOutput = JSON.stringify(output);

		this.writeFile(stringifiedOutput)

		return silent ? '' : stringifiedOutput;
	}
	
	private writeFile(file: string) {
		if (fs.existsSync(outputFileName)) fs.unlinkSync(outputFileName);
		fs.appendFileSync(outputFileName, file)
	}
}