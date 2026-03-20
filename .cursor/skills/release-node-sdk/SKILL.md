---
name: release-node-sdk
description: Release a new version of the Kessel Node.js SDK (@project-kessel/kessel-sdk). Guides through version bump, quality checks, npm publish, git tagging, and GitHub release creation. Use when the user wants to release, publish, bump version, or cut a new release of the Node SDK.
---

# Release Kessel Node.js SDK

## Prerequisites

- Write access to the GitHub repository
- npm account with publish access to `@project-kessel/kessel-sdk`
- Node 20+
- [buf](https://github.com/bufbuild/buf) for protobuf/gRPC code generation
- [jq](https://jqlang.github.io/jq/) for extracting the version from `package.json`
- [gh](https://cli.github.com/) (GitHub CLI) for creating releases

## Release Process

### Step 1: Determine the Version

Check existing tags to find the current version:

```bash
git fetch --tags
git tag --sort=-v:refname | head -5
```

Or via GitHub:

```bash
gh release list --limit 5
```

Choose the new version following [Semantic Versioning](https://semver.org/):
- **MAJOR**: incompatible API changes
- **MINOR**: backward-compatible new functionality
- **PATCH**: backward-compatible bug fixes

### Step 2: Update the Version

Edit `package.json` and set the `version` field to the new version number.

Then set the `VERSION` env var from `package.json` for use in subsequent steps:

```bash
export VERSION=$(cat package.json | jq .version -r)
echo "Releasing version: v${VERSION}"
```

### Step 3: Update Dependencies

```bash
npm install
```

### Step 4: Run Quality Checks

```bash
npm test
npm run lint
npm run build
```

### Step 5: Commit and Push

```bash
git add package.json package-lock.json
git commit -m "chore: bump version to ${VERSION}"
git push origin main
```

Include any other changed files (generated code, etc.) in the commit.

### Step 6: Build and Publish to npm

```bash
npm run build
npm publish
```

### Step 7: Tag the Release

```bash
git tag -a v${VERSION} -m "Release version ${VERSION}"
git push origin v${VERSION}
```

### Step 8: Create GitHub Release

```bash
gh release create v${VERSION} --title "v${VERSION}" --generate-notes
```

Or manually:

- Go to the [GitHub Releases page](https://github.com/project-kessel/kessel-sdk-node/releases)
- Click "Create a new release"
- Select the tag you just created
- Add release notes describing the changes
- Publish the release

## Quick Reference Checklist

```
Release v${VERSION}:
- [ ] Check existing tags and determine new version
- [ ] Update package.json version
- [ ] Set VERSION env var
- [ ] Update dependencies (npm install)
- [ ] Run npm test, npm run lint, npm run build
- [ ] Commit and push version bump
- [ ] Publish to npm (npm publish)
- [ ] Create and push git tag (v${VERSION})
- [ ] Create GitHub release
```
