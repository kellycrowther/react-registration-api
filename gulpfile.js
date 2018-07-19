var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var spawn = require('child_process').spawn;
var node;

function buildTS() {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("build"));
}

function startServer() {
  if (node) node.kill()
  node = spawn('node', ['build/server.js'], { stdio: 'inherit' })
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
}

gulp.task("build:scripts", function () {
  buildTS();
});

gulp.task('server', () => {
  // needed setTimeout to get rid of bug where server wasn't picking up new build
  setTimeout(startServer, 10);
});

gulp.task("watch", ["build:scripts", "server"], () => {
  gulp.watch('src/**/*', ['build:scripts', "server"]);
});

gulp.task("default", ["watch"]);

process.on('exit', function () {
  if (node) node.kill()
})
