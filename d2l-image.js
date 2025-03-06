import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

class D2LImage extends LitElement {
	static get properties() {
		return {
			/**
			 * Alternate text describing the image
			 * @type {string}
			 */
			alternateText: { type: String, attribute: 'alternate-text' },
			/**
			 * URL of the image
			 * @type {string}
			 */
			imageUrl: { type: String, attribute: 'image-url' },
			/**
			 * token used to authenticate the image retrieval
			 * @type {string}
			 */
			token: { type: String },
			/**
			 * URL of the image to display while waiting for imageUrl to load
			 * @type {string}
			 */
			defaultImage: { type: String, attribute: 'default-image-url' },
			_imageUrl: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			img {
				border-radius: var(--d2l-image-border-radius);
				height: 100%;
				object-fit: var(--d2l-image-object-fit);
				width: 100%;
			}
		`;
	}

	constructor() {
		super();
		this.imageUrl = '';
		this.alternateText = '';
		this.defaultImage = '';
		this.token = undefined;
	}

	render() {
		if (!this._imageUrl) {
			if (this.defaultImage) {
				return html `<img alt="${this.alternateText}" src="${this.defaultImage}"></img>`;
			} else {
				return nothing;
			}
		}

		return html`
			<img alt="${this.alternateText}" src="${ifDefined(this._imageUrl)}">
		`;
	}

	updated(changedProperties) {
		if (changedProperties.has('imageUrl') || changedProperties.has('token')) {
			this._loadImage();
		}
	}

	async _loadImage() {
		if (!this.imageUrl) {
			return;
		}

		if (!this.token) {
			this._imageUrl = this.imageUrl;
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

			response = await window.fetch(this.imageUrl, { method: 'GET', headers });

			const blob = await response.blob();
			this._imageUrl = URL.createObjectURL(blob);

			this.dispatchEvent(new CustomEvent('d2l-image-loaded', {
				bubbles: false,
				composed: false,
				detail: { response }
			}));

		} catch (e) {
			this._imageUrl = this.imageUrl;

			this.dispatchEvent(new CustomEvent('d2l-image-failed-to-load', {
				bubbles: false,
				composed: false,
				detail: { response }
			}));
		}
	}
}

customElements.define('d2l-image', D2LImage);
