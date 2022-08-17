import '../d2l-image.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { stub } from 'sinon';

describe('d2l-image', () => {
	let fetchStub;

	beforeEach(() => {
		fetchStub = stub(window, 'fetch');
	});

	afterEach(() => {
		fetchStub.restore();
	});

	it('loads element', async() => {
		const el = await fixture(html`<d2l-image></d2l-image>`);
		expect(el).to.exist;
	});

	it('does not render an <img> without image url', async() => {
		const el = await fixture(html`<d2l-image></d2l-image>`);
		expect(el.shadowRoot.querySelector('img')).to.not.exist;
	});

	describe('Hypermedia calls', () => {

		beforeEach(() => {
			fetchStub.resolves({ ok: true });
		});

		describe('Sending requests', () => {

			it('should not send a request without an image url', async() => {
				const el = await fixture(html`<d2l-image></d2l-image>`);

				expect(el.imageUrl).to.be.undefined;
				expect(fetchStub).to.not.have.been.called;
			});

			it('should send a request with an image url', async() => {
				const el = await fixture(html`<d2l-image image-url="image.jpg"></d2l-image>`);

				expect(el.imageUrl).to.equal('image.jpg');
				expect(fetchStub).to.have.been.called;
			});
		});

		describe('Receiving responses', () => {

			it('should update image src attribute and fire image-loaded event if request was successful', async() => {
				const response = new Response(new Blob(['image'], { type: 'image/jpeg' }));
				fetchStub.resolves(response);

				const el = await fixture(html`<d2l-image></d2l-image>`);

				setTimeout(() => el.imageUrl = 'image4.jpg');

				const { detail } = await oneEvent(el, 'd2l-image-loaded');
				expect(detail.response).to.equal(response);

				const imgElement = el.shadowRoot.querySelector('img');
				expect(imgElement).to.exist;
				expect(imgElement.src).to.have.string('blob:http://localhost:');
			});

			it('should fire a failed-to-load event if the request was not successful', async() => {
				const response = { status: 404 };
				fetchStub.resolves(response);

				const el = await fixture(html`<d2l-image></d2l-image>`);

				setTimeout(() => el.imageUrl = 'none.jpg');

				const { detail } = await oneEvent(el, 'd2l-image-failed-to-load');
				expect(detail.response).to.equal(response);

				const imgElement = el.shadowRoot.querySelector('img');
				expect(imgElement).to.exist;
				expect(imgElement.src).to.have.string('none.jpg');
			});
		});
	});
});
