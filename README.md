# d2l-image

[![CI](https://github.com/Brightspace/d2l-image/actions/workflows/ci.yml/badge.svg)](https://github.com/Brightspace/d2l-image/actions/workflows/ci.yml)

Web component for displaying images that require authentication.

## Usage

```html
<d2l-image
	alternate-text="Alt text that will appear on image"
	image-url="https://example.com/image-to-fetch.jpg"
	token="some-oauth-token">
</d2l-image>
```

When both `image-url` and `token` are non-null, `d2l-image` will load the image.

## Developing

After cloning the repo, run `npm install` to install dependencies.

### Running the demos

Start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo pages:

```shell
npm start
```

### Linting

```shell
# eslint, lit-analyzer
npm run lint

# eslint only
npm run lint:eslint

# lit-analyzer only
npm run lint:lit
```

### Testing

```shell
# lint and unit tests
npm test

# unit tests
npm run test:headless
```

### Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.

