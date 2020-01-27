# tslint-bamboo-formatter

tslint-bamboo-formatter is a Typescript library for creating JSON output files, which used by Bamboo for logs.

## Installation

Use the package manager [npm](https://www.npmjs.com/package/tslint-bamboo-formatter) to install tslint-bamboo-formatter.

```bash
npm install --save-dev tslint-bamboo-formatter
```

## Usage

Add this script to `scripts` section at your package.json.

| Flags  | Description  |
|---|---|
| -s, --formatters-dir  | An additional formatters directory, for user-created formatters.  |
| -q, --quiet  | Hide non "error" severity linting errors from output  |
| -t, --format: |  In our case used by additional formatters if the --formatters-diroption is set. |

### tslint CLI example

```
{
  scripts: {
    ...,
    tslint: "tslint -s node_modules/tslint-bamboo-formatter/formatter/ -t bamboo"
  }
}
```

### tslint.config

```js
module.exports = {
...,
  tslint: {
    formattersDirectory: 'node_modules/tslint-bamboo-formatter/formatter/',
    formatter: 'bamboo'
  }
]

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)