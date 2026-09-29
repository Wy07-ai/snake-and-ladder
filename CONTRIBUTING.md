# Contributing

Contributions are welcome. Keep changes focused, preserve the existing component and hook boundaries, and describe user-visible behavior in the pull request.

## Local setup

Prerequisites: Node.js compatible with the installed Vite version and npm.

```bash
npm install
npm run dev
```

Before opening a pull request, run the available checks:

```bash
npm run lint
npm run build
```

There is currently no `npm test` script. Include manual verification steps for behavior changes and screenshots for visual changes when useful.

## Branching

1. Start from an up-to-date `main` branch.
2. Create a focused branch, for example `feature/chat-reactions` or `fix/turn-order`.
3. Keep commits small and use clear messages, such as `feat: add chat reactions` or `fix: prevent extra bot roll`.
4. Do not commit generated output, local secrets, or unrelated changes.

## Pull requests

- Open a pull request targeting `main`.
- Explain the problem and summarize the implementation.
- List the checks you ran and any manual test steps.
- Add screenshots or a short recording for UI changes.
- Call out follow-up work or known limitations instead of silently expanding scope.

For larger changes, discuss the approach in an issue before starting implementation.