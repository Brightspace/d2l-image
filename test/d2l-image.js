/* global describe, it, beforeEach, afterEach, fixture, expect, sinon */

'use strict';

describe('<d2l-image>', function() {
	var fakeTimer,
		server,
		widget;

	beforeEach(function() {
		server = sinon.fakeServer.create();
		server.respondImmediately = true;
		fakeTimer = sinon.useFakeTimers();
		widget = fixture('d2l-image-fixture');
	});

	afterEach(function() {
		server.restore();
	});

	it('loads element', function() {
		expect(widget).to.exist;
	});

	describe('Hypermedia calls', function() {
		describe('Sending requests', function() {
			it('should not send a request without an auth token', function() {
				var sent = false;

				server.respondWith(
					'GET',
					widget.imageUrl,
					function(req) {
						sent = true;
						req.respond(200);
					});

				widget = fixture('d2l-image-fixture');

				fakeTimer.tick(1);
				expect(sent).to.equal(false);
			});

			it('should send a request with an auth token', function() {
				var sent = false;

				server.respondWith(
					'GET',
					widget.imageUrl,
					function(req) {
						expect(req.requestHeaders['authorization']).to.equal('Bearer ' + 'My Token');
						req.respond(200);
						sent = true;
					});

				widget = fixture('d2l-image-fixture-populated');

				fakeTimer.tick(1);
				expect(sent).to.equal(true);
			});
		});

		describe('Receiving a response', function() {
			it('should update image src attribute if the request is successful', function() {
				var response = {
					detail: {
						response: new Blob([], { type: 'image/jpeg' }),
						status: 200
					}
				};

				widget = fixture('d2l-image-fixture');

				widget._onImageResponse(response);
				expect(widget.$.image.src);
			});

			it('should fire a failed-to-load event if the request was not successful', function(done) {
				var response = {
					detail: {
						status: 404
					}
				};

				widget = fixture('d2l-image-fixture');
				widget.addEventListener('d2l-image-failed-to-load', function(e) {
					expect(!widget.$.image.src);
					expect(e.detail.response).to.equal(response);
					done();
				});

				widget._onImageResponse(response);
			});
		});
	});
});
