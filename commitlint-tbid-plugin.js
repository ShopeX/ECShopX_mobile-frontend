module.exports = {
  rules: {
    'tbid-header': (parsed, when = 'always') => {
      const matches =
        typeof parsed.header === 'string' && /^\[TBID:[A-Za-z0-9]+-\d+\]\s.+/.test(parsed.header)
      const negated = when === 'never'

      return [
        negated ? !matches : matches,
        'commit message must start with [TBID:PROJECT-123] description'
      ]
    }
  }
}
