# eslint-plugin-import-levels

Prohibited import from wrong level

### Prohibited

Mobile -> Desktop

Mobile -> General

-------------

Desktop -> Mobile

Desktop -> General

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-import-levels`:

```
$ npm install eslint-plugin-import-levels --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-import-levels` globally.

## Usage

Add `import-levels` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "import-levels"
    ]
}
```
