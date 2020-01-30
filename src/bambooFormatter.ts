import * as Lint from 'tslint';
import * as fs from 'fs';
import * as path from 'path';
import { IOutputFile, IFailure } from './bambooFormatterTypes';

const outputFileName = 'tslint-results.json';

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
		consumer: 'human',
	};

	public format(failures: Lint.RuleFailure[]): string {
		const errors = failures.filter(falture => falture.getRuleSeverity() === 'error');

		const output: IOutputFile = {
			stats: {
				tests: 1 + errors.length, // watchdog + failures
				passes: 1,
				failures: errors.length,
				duration: 0,
				start: new global.Date(),
				end: new global.Date(),
			},
			failures: [],
			passes: [
				{
					// The underlying issue is that Bamboo expects the job to return a set of tests
					// that either pass or fail, but tslint outputs nothing if a file passes.
					title: 'Watchdog',
					fullTitle: 'Test that provides successful Mocha Test Parser execution',
					duration: 0,
					errorCount: 0,
				},
			],
			skipped: [],
		};

		const failuresJSON = errors.reduce((memo: {[key: string]: IssueGroup}, failure: Lint.RuleFailure) => {
			let issueGroup = memo[failure.getFileName()];

			if (issueGroup) {
					issueGroup.add = failure;
			} else {
				memo = {
					...memo,
					[failure.getFileName()]: new IssueGroup(failure),
				};
			}

			return memo;
		}, {});

		output.failures = Object.values(failuresJSON).reduce((memo: IFailure[], item: IssueGroup) => memo = ([
			...memo,
			...item.getFaltures.map((failure: Lint.RuleFailure) => {
				const fileName = (failure.getFileName() || '').match('(?<=/)[^/]+$');
				const relativePath = failure.getFileName().match('src/(.*)');
				const filePath = relativePath ? path.resolve(relativePath[0]) : '';
				const failurePosition = failure.getStartPosition().getPosition();
				const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
				const positionTuple = `${lineAndCharacter.line + 1}:${lineAndCharacter.character + 1}`;

				return ({
					// structure:
					// TODO move to readme
					// tslint:disable-next-line: max-line-length
					// https://bitbucket.org/atlassian/bamboo-nodejs-plugin/src/bfde4b1a1931c11f3328206891b9bf3f0b0575fe/src/main/java/com/atlassian/bamboo/plugins/nodejs/tasks/mocha/parser/MochaSuiteTest.java?at=master#lines-9
					// e.g. :
					// 		"title": "getBackendLocalesOptions:707", // Must be uniq per error
					//		"fullTitle": "semicolon",
					// 		"duration": 0,
					// 		"errorCount": 1,
					// 		"error": "src/js/app/getBackendLocalesOptions.ts:24:19 - Missing semicolon"
					//
					// Title requires split because of Bamboo-specific name parser, which cut it by dot
					title: fileName ? fileName[0].split('.')[0] + ':' + failurePosition : '',
					fullTitle: failure.getRuleName(),
					duration: 0,
					errorCount: 1,
					error: `${filePath}:${positionTuple}` + ' - ' + failure.getFailure(),
				});
			}),
		]), []);

		// We need prettified JSON output for correct parser results,
		// so indent is set to 2.
		const stringifiedOutput = JSON.stringify(output, null, 2);

		this.writeFile(stringifiedOutput);

		return stringifiedOutput;

	}

	private writeFile(file: string) {
		if (fs.existsSync(outputFileName)) fs.unlinkSync(outputFileName);

		fs.appendFileSync(outputFileName, file);

		process.exit(0); // because formatters made by the maintainers of tslint don't work as they should.
	}
}
