import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-image">
	<template strip-whitespace="">
		<style>
			:host {
				display: block;
			}

			img {
				width:100%;
				height: 100%;
				border-radius: var(--d2l-image-border-radius);
				object-fit: var(--d2l-image-object-fit);
			}
		</style>

		<iron-ajax id="imageRequest" url="[[imageUrl]]" headers="[[_headers]]" on-iron-ajax-response="_onImageResponse" on-iron-ajax-error="_onImageResponse" handle-as="blob">
		</iron-ajax>

		<img id="image" alt$="[[alternateText]]">
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);

Polymer({
	is: 'd2l-image',

	properties: {
		alternateText: {
			type: String,
			reflectToAttribute: true,
		},
		imageUrl: {
			type: String,
			value: null
		},
		token: String,
		_headers: String
	},

	observers: [
		'_onImageUrlChange( imageUrl, token )'
	],

	_onImageUrlChange: function(imageUrl, token) {
		if (imageUrl && token) {
			this._headers = {
				Authorization: 'Bearer ' + token
			};
			this.$.imageRequest.generateRequest();
		} else if (imageUrl) {
			this.$.image.src = imageUrl;
		}
	},

	_onImageResponse: function(response) {
		if (response.detail.status === 200) {
			if (this.$.image.src) {
				URL.revokeObjectURL(this.$.image.src);
			}
			this.$.image.src = URL.createObjectURL(response.detail.response);
			this.dispatchEvent(new CustomEvent('d2l-image-loaded', {
				bubbles: true,
				composed: true,
				detail: { response: response }
			}));
		} else {
			this.dispatchEvent(new CustomEvent('d2l-image-failed-to-load', {
				bubbles: true,
				composed: true,
				detail: { response: response }
			}));
		}
	}
});
