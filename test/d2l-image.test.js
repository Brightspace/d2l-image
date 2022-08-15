import '../d2l-image.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-image', () => {
	it('loads element', async() => {
		const el = await fixture(html`<d2l-image></d2l-image>`);
		expect(el).to.exist;
	});
});
