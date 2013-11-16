var fs        = require( 'fs' ),
	stopwatch = require( './stopwatch' );

var jconv     = require( '../jconv.min' ),
	Iconv     = require( 'iconv' ).Iconv;

var buffers = {
	'SJIS' : fs.readFileSync( './input/kokoro-sjis.txt' ),
	'UTF8' : fs.readFileSync( './input/kokoro-utf8.txt' ),
	'JIS'  : fs.readFileSync( './input/kokoro-jis.txt' ),
	'EUCJP': fs.readFileSync( './input/kokoro-eucjp.txt' ),
};

var logs = {};

function speedTest( from, to ) {
	var FROM    = from.toUpperCase(),
		TO      = to.toUpperCase(),
		from    = from.toLowerCase(),
		to      = to.toLowerCase();

	var fixFROM = ( FROM === 'JIS'  ) ? 'ISO-2022-JP-1' :
	              ( FROM === 'SJIS' ) ? 'CP932' : FROM;

	var fixTO   = ( TO === 'JIS'  ) ? 'ISO-2022-JP-1' :
	              ( TO === 'SJIS' ) ? 'CP932' : TO;

	var _jconv  = jconv;
	var _iconv  = new Iconv( fixFROM, fixTO + '//TRANSLIT//IGNORE' );

	var buffer  = buffers[ FROM ];
	var title   = '[ ' + FROM + ' -> ' + TO + ' ]';

	console.log( title );

	stopwatch
		.reset()
		.add({
			name: 'jconv',
			func: function() {
				_jconv.convert( buffer, TO, FROM );
			}
		})
		.add({
			name: 'iconv',
			func: function() {
				_iconv.convert( buffer );
			}
		});

	stopwatch
		.run( 100 )
		.show();

	logs[ title ] = stopwatch.results;
}

function writeLog() {
	var outputString = 'var speedLog = \'' + JSON.stringify( logs ) + '\';';
	fs.writeFileSync( './chart/speedLog.js', outputString );
}

speedTest( 'UTF8', 'SJIS' );
speedTest( 'UTF8', 'JIS' );
speedTest( 'UTF8', 'EUCJP' );

speedTest( 'SJIS', 'UTF8' );
speedTest( 'SJIS', 'JIS' );
speedTest( 'SJIS', 'EUCJP' );

speedTest( 'JIS', 'UTF8' );
speedTest( 'JIS', 'SJIS' );
speedTest( 'JIS', 'EUCJP' );

speedTest( 'EUCJP', 'UTF8' );
speedTest( 'EUCJP', 'SJIS' );
speedTest( 'EUCJP', 'JIS' );

writeLog();
