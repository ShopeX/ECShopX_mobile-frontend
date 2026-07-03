const TBID_HEADER = /^\[TBID:([A-Za-z0-9]+-\d+)\]\s(?:(\w+)(?:\(([^)]*)\))?(?::|\s)\s*)?(.+)$/

module.exports = {
  // 关闭默认忽略（含 semver release），否则无 TBID 的 chore(release): x.x.x 会被跳过
  defaultIgnores: false,
  // 保留 merge / revert 等系统提交的豁免，不要求 TBID
  ignores: [
    (message) => /^Merge pull request/m.test(message),
    (message) => /^Merge tag /m.test(message),
    (message) => /^Revert /m.test(message),
    (message) => /^(fixup|squash)!/m.test(message),
    (message) => /^Merged PR /m.test(message),
    (message) => /^Merge remote-tracking branch/m.test(message),
    (message) => /^Automatic merge/m.test(message),
    (message) => /^Auto-merged /m.test(message)
  ],
  plugins: [require('./commitlint-tbid-plugin')],
  parserPreset: {
    parserOpts: {
      headerPattern: TBID_HEADER,
      headerCorrespondence: ['tbid', 'type', 'scope', 'subject']
    }
  },
  rules: {
    'tbid-header': [2, 'always'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'feature',
        'bug',
        'fix',
        'ui',
        'docs',
        'style',
        'perf',
        'release',
        'deploy',
        'refactor',
        'test',
        'chore',
        'revert',
        'merge',
        'build',
        'ci',
        'workflow'
      ]
    ],
    'type-case': [2, 'always', 'lower-case'],
    // type 可选，兼容 [TBID:xxx] Bug修复 这类 GitLab 格式
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'body-leading-blank': [1, 'always'],
    'header-max-length': [0, 'always', 100]
  }
}
