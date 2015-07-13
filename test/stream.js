'use strict';

var resumer = require( 'resumer' ),
	should = require( 'should' ),
	StreamCache = require('stream-cache'),
	DecodeSjisTransform = require( __dirname + '/../').DecodeSjisTransform;

describe( 'DecodeSjisTransform streaming SJIS buffers', function() {
	// 仕事,好条
	it( 'should convert complete input to complete UTF8 buffers', function(done) {
		var bufComplete = [
			new Buffer([0x8e, 0x64, 0x8e, 0x96]),
			new Buffer([0x2c, 0x8d, 0x44, 0x8f, 0xf0])
		];
		var readStream = resumer();
		var cache = new StreamCache();
		var transform = new DecodeSjisTransform();

		bufComplete.forEach(readStream.queue);
		setTimeout(function() {
			should(cache._buffers[0].toString()).eql('仕事');
			should(cache._buffers[1].toString()).eql(',好条');
			done();
		}, 500);
		readStream
			.pipe(transform).on('error', done)
			.pipe(cache).on('error', done);

	});

	it( 'should convert broken/split input to complete UTF8 buffers', function(done) {
		var bufComplete = [
			new Buffer([0x8e, 0x64, 0x8e]),
			new Buffer([0x96, 0x2c, 0x8d, 0x44, 0x8f, 0xf0])
		];
		var readStream = resumer();
		var cache = new StreamCache();
		var transform = new DecodeSjisTransform();

		bufComplete.forEach(readStream.queue);
		setTimeout(function() {
			should(cache._buffers[0].toString()).eql('仕');
			should(cache._buffers[1].toString()).eql('事,好条');
			done();
		}, 500);
		readStream
			.pipe(transform).on('error', done)
			.pipe(cache).on('error', done);

	});
});
