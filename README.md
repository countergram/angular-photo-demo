This is an original demo app of a photo gallery with some dynamic resizing features using Angular and Grunt.

A custom Grunt task resizes input pictures to various size stops and creates a static JSON file that indexes them. The Angular app uses the JSON file to display a gallery and allows viewing at different size stops that fit cleanly to the browser width.

Installation:

    npm install
    # put some images into imgsrc/
    grunt images # wait a while
    grunt
    # need to serve the dist/ directory on a local http server or possibly use Firefox to avoid security issues with requesting images.json
