'use strict';

var Transform = require('stream').Transform;
var jconv = require('./jconv');

exports.DecodeSjisTransform = DecodeSjisTransform;
exports.jconv = jconv;

function DecodeSjisTransform(options) {
	if (!(this instanceof DecodeSjisTransform)) {
		return new DecodeSjisTransform(options);
	}

	options = options || {};
	options.encoding = this.encoding = 'utf8';
	Transform.call(this, options);

	// Not so sweet: jconv init is module-wide
	jconv.init({overflowEnabled:true});
}

var end = function() {
	var overflowChar = jconv.getOverflowChar();
	if (overflowChar) {
		return new Buffer([overflowChar]);
	}
	return null;
};

DecodeSjisTransform.prototype = Object.create(Transform.prototype, {
	constructor: { value: DecodeSjisTransform }
});

DecodeSjisTransform.prototype._transform = function(chunk, encoding, done) {
	if (!Buffer.isBuffer(chunk))
		return done(new Error("DecodeSjisTransform decoding stream needs buffers as its input."));
	try {
		var res = jconv.convert(chunk, 'sjis', this.encoding);
		if (res && res.length) this.push(res, this.encoding);
		done();
	}
	catch (e) {
		done(e);
	}
};

DecodeSjisTransform.prototype._flush = function(done) {
	try {
		var res = end();
		if (res && res.length) this.push(res, this.encoding);
		done();
	}
	catch (e) {
		done(e);
	}
};

