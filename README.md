This is an original demo app of a photo gallery with some dynamic resizing features using Angular and Grunt.

A custom Grunt task resizes input pictures to various size stops and creates a static JSON file that indexes them. The Angular app uses the JSON file to display a gallery and allows viewing at different size stops that fit cleanly to the browser width.

Installation
------------

1. Install [`graphicsmagick`](http://www.graphicsmagick.org/) (external dependency)

2. Run `npm install`

3. Put some photos into imgsrc/

4. Run `grunt images` to process the source photos into their sizes and create `images.json`

5. Run `grunt` to build the app

6. Serve the dist/ directory on an HTTP server or open dist/index.html in Firefox, which allows HTTP requests for local files in the same directory.

Testing
-------

Assuming the Karma CLI is installed (`npm install -g karma-cli`), run `karma start` after install step 5.
