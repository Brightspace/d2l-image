import 'd2l-fetch/d2l-fetch.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

class D2LImage extends LitElement {
	static get properties() {
		return {
			/**
			 * Alternate text describing the image
			 * @type {string}
			 */
			altText: { type: String, attribute: 'alt-text' },
			/**
			 * URL of the image
			 * @type {string}
			 */
			imageUrl: { type: String, attribute: 'image-url' },
			_imageUrl: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			img {
				width:100%;
				height: 100%;
				border-radius: var(--d2l-image-border-radius);
				object-fit: var(--d2l-image-object-fit);
			}
		`;
	}

	constructor() {
		super();
		this.imageUrl = undefined;
		this.token = undefined;
		this._loadImage();
	}

	render() {
		return html`
			<img alt="${this.altText}" src="${ifDefined(this._imageUrl)}">
		`;
	}

	updated(changedProperties) {
		if (changedProperties.has('imageUrl') || changedProperties.has('token')) {
			this._loadImage();
		}
	}

	async _loadImage() {
		if (!this.imageUrl || !this.token) {
			return;
		}

		let response;

		try {
			const tokenPromise = await (typeof (this.token) === 'function')
				? this.token()
				: Promise.resolve(this.token);

			const tokenString = await tokenPromise;

			const headers = new Headers();
			if (tokenString) {
				headers.append('Authorization', `Bearer ${tokenString}`);
			}

			response = await window.d2lfetch
				.removeTemp('simple-cache')
				.removeTemp('dedupe')
				.fetch(this.imageUrl, { method: 'GET', headers });

			const blob = await response.blob();
			this._imageUrl = URL.createObjectURL(blob);

			this.dispatchEvent(new CustomEvent('d2l-image-loaded', {
				bubbles: true,
				composed: true,
				detail: { response }
			}));

		} catch (e) {
			this._imageUrl = this.imageUrl;

			this.dispatchEvent(new CustomEvent('d2l-image-failed-to-load', {
				bubbles: true,
				composed: true,
				detail: { response }
			}));
		}
	}
}

customElements.define('d2l-image', D2LImage);
