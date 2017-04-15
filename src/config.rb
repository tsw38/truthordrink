require 'compass/import-once/activate'

http_path = "/"
css_dir = "../public/css"
sass_dir = "sass"
images_dir = "images"
javascripts_dir = "javascripts"
sourcemap = (environment == :production) ? false : true
output_style = (environment == :production) ? :compressed : :expanded
line_comments = false
