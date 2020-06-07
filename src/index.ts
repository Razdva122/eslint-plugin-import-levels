import { Rule } from 'eslint';
import { ImportDeclaration } from 'estree';

type TLevel = 'mobile' | 'general' | 'desktop';

const forbiddenImports: { [key in TLevel]: TLevel[] } = {
  mobile: ['desktop'],
  general: ['mobile', 'desktop'],
  desktop: ['mobile'],
};

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prohibited import from wrong level',
      url: 'https://github.com/Razdva122/linter-import-levels',
    }
  },
  create: function(context) {
    const fileName = context.getFilename();
    if (fileName.indexOf('/src/') === -1) {
      return {};
    }

    const splitedPath = fileName.split('/');
    const levels: TLevel[] = ['mobile', 'desktop', 'general'];
    let levelOfFile: TLevel | undefined;

    levels.forEach((level) => {
      if (splitedPath.includes(level)) {
        levelOfFile = level;
      }
    });

    if (!levelOfFile) {
      return {};
    }
    return {
      ImportDeclaration: function(node) {
        const { value } = (node as ImportDeclaration).source;
        if (!value) {
          return;
        }
        const splitedPath = (value as string).split('/');

        forbiddenImports[levelOfFile!].forEach((forbiddenLevel) => {
          if (splitedPath.includes(forbiddenLevel)) {
            context.report({
              node,
              message: `You cant import ${forbiddenLevel} on ${levelOfFile} level`
            })
          }
        })
      }
    }
  }
}

module.exports = {
  rules: {
    'import-levels': rule
  }
}
