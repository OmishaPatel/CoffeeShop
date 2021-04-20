// webpack.mix.js

let mix = require('laravel-mix');

mix.js('resources/js/main.js', 'public/js/main.js').sass('resources/scss/app.scss','public/css/app.css');