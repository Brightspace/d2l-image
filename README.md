# d2l-image

[![Build Status](https://travis-ci.org/Brightspace/d2l-image.svg?branch=master)](https://travis-ci.org/Brightspace/d2l-image)

A [Polymer](https://www.polymer-project.org)-based web component for displaying images that require authentication.

## Installation

Clone the repo and install npm and bower dependencies:

```sh
npm install
```

Run tests:

```sh
npm test
```

## Usage

```html
<d2l-image
	alternate-text="Alt text that will appear on image"
	image-url="https://example.com/image-to-fetch.jpg"
	token="some-oauth-token">
</d2l-image>
```

When both `image-url` and `token` are non-null, `d2l-image` will load the image.

## Coding styles

Follow the [EditorConfig](http://editorconfig.org) rules used in this repo.

## Versioning

Commits and PR merges to master will automatically do a minor version bump which will:
* Update the version in `package.json`
* Add a tag matching the new version
* Create a github release matching the new version

By using either **[increment major]** or **[increment patch]** notation inside your merge message, you can overwrite the default version upgrade of minor to the position of your choice.
