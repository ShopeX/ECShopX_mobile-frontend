# f2e-ai Workflow

1. Code analyst: analyze stack, structure, configs, and conventions into `.f2e-ai/handbook/`
2. Requirement analyst: clarify the request and create `.f2e-ai/requirements/<id>/requirement.md`
3. UI alignment: when needed, write `.f2e-ai/requirements/<id>/ui-notes.md`
4. API alignment: when needed, write `.f2e-ai/requirements/<id>/api-notes.md`
5. Plan writing: generate tests first and confirm `plan.md`
6. Plan execution: implement against the confirmed plan
7. i18n: localize changed files when the project requires it
8. E2E and commit: run Playwright, write summaries, then commit and open PR
