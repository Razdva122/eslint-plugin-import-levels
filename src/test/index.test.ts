//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester, Linter } from 'eslint';

const { rules } = require('../index');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/* Info about levels
 * level -> import into level
 * mobile -> mobile (OK), mobile -> general (NOT OK), mobile -> desktop (NOT OK)
 * desktop -> desktop (OK), desktop -> general (NOT OK), desktop -> mobile (NOT OK)
 * general -> general (OK), general -> desktop (OK), general -> mobile (OK)
 */

const parserOptions: Linter.ParserOptions = {
  ecmaVersion: 2015,
  "sourceType": "module",
}

// Import from any level are okay if path not includes src
const fileNotInSrcPath: RuleTester.ValidTestCase = {
  code: `import Foo from '@/mobile/Foo.vue';`,
  filename: 'test/desktop/index.ts',
  parserOptions
}

const importFromGeneralToGeneral: RuleTester.ValidTestCase = {
  code: `import Foo from '@/general/Foo.vue';\nimport Bar from '@/general/Bar.vue';`,
  filename: 'test/src/general/index.ts',
  parserOptions
}

const importFromGeneralAndMobileToMobile: RuleTester.ValidTestCase = {
  code: `import Foo from '@/general/Foo.vue';\nimport Bar from '@/mobile/Bar.vue';`,
  filename: 'test/src/mobile/index.ts',
  parserOptions
}

const importFromGeneralAndDesktopToDesktop: RuleTester.ValidTestCase = {
  code: `import Foo from '@/general/Foo.vue';\nimport Bar from '@/desktop/Bar.vue';`,
  filename: 'test/src/desktop/index.ts',
  parserOptions
}

const importFromMobileToMobile: RuleTester.ValidTestCase = {
  code: `import Foo from '@/mobile/Foo.vue';\nimport Bar from '@/mobile/Bar.vue';`,
  filename: 'test/src/mobile/index.ts',
  parserOptions
}

const validNestedImport: RuleTester.ValidTestCase = {
  code: `import Foo from '@/desktop/abc/Foo.vue';\nimport Bar from '@/abc/desktop/Bar.vue';`,
  filename: 'test/src/abc/desktop/abc/index.ts',
  parserOptions
}

// Invalid cases

const importFromMobileToDesktop: RuleTester.InvalidTestCase = {
  code: `import Foo from '@/mobile/Foo.vue';\nimport Bar from '@/mobile/Bar.vue';`,
  filename: 'test/src/desktop/index.ts',
  parserOptions,
  errors: [{
    message: 'You cant import mobile on desktop level'
  }, {
    message: 'You cant import mobile on desktop level'
  }]
}

const importFromDesktopToMobile: RuleTester.InvalidTestCase = {
  code: `import Foo from '@/mobile/Foo.vue';\nimport Bar from '@/desktop/Bar.vue';`,
  filename: 'test/src/mobile/index.ts',
  parserOptions,
  errors: [{
    message: 'You cant import desktop on mobile level'
  }]
}

const importFromDesktopAndMobileToGeneral: RuleTester.InvalidTestCase = {
  code: `import Foo from '@/mobile/Foo.vue';\nimport Bar from '@/desktop/Bar.vue';`,
  filename: 'test/src/general/index.ts',
  parserOptions,
  errors: [{
    message: 'You cant import mobile on general level'
  }, {
    message: 'You cant import desktop on general level'
  },]
}

const invalidImportFromNestedLevels: RuleTester.InvalidTestCase = {
  code: `import Foo from '@/abc/mobile/Foo.vue';\nimport Bar from '@/desktop/bar/Bar.vue';`,
  filename: 'test/src/foo/general/index.ts',
  parserOptions,
  errors: [{
    message: 'You cant import mobile on general level'
  }, {
    message: 'You cant import desktop on general level'
  },]
}

const ruleTester = new RuleTester();
ruleTester.run("import from wrong level", rules['warn-import-from-wrong-level'], {

    valid: [
      fileNotInSrcPath,
      importFromGeneralToGeneral,
      importFromGeneralAndMobileToMobile,
      importFromGeneralAndDesktopToDesktop,
      importFromMobileToMobile,
      validNestedImport,
    ],

    invalid: [
      importFromMobileToDesktop,
      importFromDesktopToMobile,
      importFromDesktopAndMobileToGeneral,
      invalidImportFromNestedLevels,
    ]
});
