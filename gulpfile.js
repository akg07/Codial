// import del from 'del';
const gulp = require('gulp');

// library for css min
const sass = require('gulp-sass')(require('node-sass'));
const cssnano = require('gulp-cssnano');

// library for js min
const uglify = require('gulp-uglify-es').default;

// library for images min
const imageMin = require('gulp-imagemin');

// library for revising name of the file :: append random number on file name
const rev=  require('gulp-rev');

// for delete pre-existed files
const del = require('del');

// compress css files
gulp.task('css', function(done){
    console.log('Minifying css');
    gulp.src('./assets/sass/**/*.css')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css'));
    
    console.log('Minified css');
    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();
});

// compress js files
gulp.task('js', function(done){
    console.log('Minifying JS');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    
    done();
});

// compress images
gulp.task('images', function(done) {
    console.log('Minfying Image')

    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imageMin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();
});

// cleaning/deleting all pre-existing files from public folder
gulp.task('clean: assets', function(done) {
    del.sync(['./public/assets'], {force: true});
    done();
});

// build 
gulp.task('build', gulp.series('clean: assets', 'css', 'js', 'images'), function(done){
    console.log('Build Success');

    done();
});

