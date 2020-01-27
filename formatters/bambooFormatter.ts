import * as Lint from "tslint";
const chalk = require('chalk');

class IssueGroup {
	public failures: Lint.RuleFailure[] = [];
  
	constructor(public filename: string) {
	  this.failures = [];
	}
  
	add(failure: Lint.RuleFailure): void {
	  this.failures.push(failure);
	}
  
	public get warningCount(): number {
	  return this.getIssueCount('warning');
	}
  
	public get errorCount(): number {
	  return this.getIssueCount('error');
	}
  
	public get fixCount(): number {
	  return this.failures.reduce(
		(count, failure) => (failure.hasFix() ? count + 1 : count),
		0
	  );
	}
  
	private getIssueCount(severity: Lint.RuleSeverity): number {
	  return this.failures.reduce(
		(count, failure) =>
		  failure.getRuleSeverity() === severity ? count + 1 : count,
		0
	  );
	}
}

type TFilesHash<T = Lint.RuleFailure> = {
	[key: string]: T[];
}

export class Formatter extends Lint.Formatters.AbstractFormatter {
	public filesHash: TFilesHash = {}

    public format(failures: Lint.RuleFailure[]): string {

		chalk.blue(failures)
		const failuresJSON = failures.reduce((memo, failure: Lint.RuleFailure) => {
			let elemsByKey = memo[failure.getFileName()];

			chalk.blue(failure)
			if (elemsByKey) {
				elemsByKey = elemsByKey.concat(failure);
			} else {
				elemsByKey = [];
			}

			return memo;
		}, this.filesHash);

		

        return JSON.stringify(failuresJSON);
	}
	
	private writeFile() {

	}
}