# tslint-bamboo-formatter

tslint-bamboo-formatter is a Typescript library for creating JSON output files, which are used by Bamboo for logs.

## Building
If you want to generate formatter (e.g. `bambooFormatter.js`), use command below (works with [npm](https://github.com/npm/npm/releases/tag/v5.2.0) version 5.2.0 and higher):

```bash
npx tsc
```

## Installation

Use the [npm](https://www.npmjs.com/package/tslint-bamboo-formatter) package manager to install tslint-bamboo-formatter.

```bash
npm install --save-dev tslint-bamboo-formatter
```

## Usage

Add this script to the `scripts` section of your package.json.

| Flags  | Description  |
|---|---|
| -s, --formatters-dir  | Additional formatters directory for custom formatters  |
| -q, --quiet  | Hide non "error" severity linting errors from output  |
| -t, --format: |  In our case used by additional formatters if the --formatters-diroption is set |

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
    formattersDirectory: 'node_modules/tslint-bamboo-formatter/formatters/',
    formatter: 'bambooFormatter.ts'
  }
]

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
