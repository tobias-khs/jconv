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

	it( 'should convert heavily broken/split input to complete UTF8 buffers', function(done) {
		//'あいうえお亜意鵜絵尾'
		var bufComplete = [
			new Buffer([0x82, 0xa0, 0x82]),
			new Buffer([0xa2, 0x82, 0xa4, 0x82]),
			new Buffer([0xa6, 0x82, 0xa8]),
			new Buffer([0x88, 0x9f, 0x88, 0xd3, 0x89, 0x4c, 0x8a]),
			new Buffer([0x47, 0x94, 0xf6])
		];
		var readStream = resumer();
		var cache = new StreamCache();
		var transform = new DecodeSjisTransform();

		bufComplete.forEach(readStream.queue);
		setTimeout(function() {
			var result = cache._buffers.map(function(buf) {
				return buf.toString();
			}).join('');
			should(result).eql('あいうえお亜意鵜絵尾');
			done();
		}, 500);
		readStream
			.pipe(transform).on('error', done)
			.pipe(cache).on('error', done);

	});
});
