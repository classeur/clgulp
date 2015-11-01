var spawn = require('child_process').spawn;
var spawnargs = require('spawn-args');
var bump = require('gulp-bump');
var util = require('gulp-util');

module.exports = function(gulp) {
	gulp.task('patch', bumpTask('patch'));
	gulp.task('minor', bumpTask('minor'));
	gulp.task('major', bumpTask('major'));

	function bumpTask(importance) {
		return function() {
			return gulp.src([
					'./package.json'
				])
				.pipe(bump({
					type: importance
				}))
				.pipe(gulp.dest('./'));
		};
	}
	return gulp;
};

function exec(cmds, cb) {
	if (!(cmds instanceof Array)) {
		cmds = [cmds];
	}
	if (cmds.length === 0) {
		return cb();
	}
	var file, args, command = cmds.shift(), options = {
		cwd: process.cwd()
	};
	// Credit: https://github.com/nodejs/node/blob/master/lib/child_process.js
	if (process.platform === 'win32') {
		file = process.env.comspec || 'cmd.exe';
		args = ['/s', '/c', '"' + command + '"'];
		options.windowsVerbatimArguments = true;
	} else {
		file = '/bin/sh';
		args = ['-c', command];
	}
	var proc = spawn(file, args, options);
	proc.stdout.pipe(process.stdout);
	proc.stderr.pipe(process.stderr);
	proc.on('error', function(error) {
		util.log(util.colors.red(error));
		cb(error);
	});
	proc.on('exit', function(code) {
		if (code) {
			return cb(code);
		}
		exec(cmds, cb);
	});
}

module.exports.exec = exec;
module.exports.util = util;
