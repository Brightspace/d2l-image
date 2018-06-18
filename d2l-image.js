import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class D2LImage extends PolymerElement {
	static get template() {
		return html`
        <style>
            :host {
                display: block;
            }

            img {
                width:100%;
                height: 100%;
            }
        </style>

        <iron-ajax
			id="imageRequest"
			url="[[imageUrl]]"
			headers="[[_headers]]"
			on-iron-ajax-response="_onImageResponse"
			on-iron-ajax-error="_onImageResponse"
			handle-as="blob">
        </iron-ajax>

        <img id="image" alt="{{alternateText}}">
`;
	}

	static get is() { return 'd2l-image'; }

	static get properties() {
		return {
			alternateText: String,
			imageUrl: {
				type: String,
				value: null
			},
			token: String,
			_headers: String
		};
	}

	static get observers() {
		return [
			'_onImageUrlChange( imageUrl, token )'
		];
	}

	_onImageUrlChange(imageUrl, token) {
		if (imageUrl && token) {
			this._headers = {
				Authorization: 'Bearer ' + token
			};
			this.$.imageRequest.generateRequest();
		} else if (imageUrl) {
			this.$.image.src = imageUrl;
		}
	}

	_onImageResponse(response) {
		if (response.detail.status === 200) {
			if (this.$.image.src) {
				URL.revokeObjectURL(this.$.image.src);
			}
			this.$.image.src = URL.createObjectURL(response.detail.response);
		} else {
			this.dispatchEvent(new CustomEvent('d2l-image-failed-to-load', {
				bubbles: true,
				composed: true,
				detail: { response: response }
			}));
		}
	}
}

customElements.define(D2LImage.is, D2LImage);
