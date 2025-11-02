from flask import (
    Flask,
    request,
    send_from_directory,
    # render_template,
)
from flask_cors import CORS

from .tagdb import TagDB


def create_app():
    static_dir = 'ui/assets'
    app = Flask(__name__, static_folder=static_dir)
    app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
    CORS(app)

    # @app.route('/')
    # def index():
    #     return render_template('index.html')

    @app.route('/getTags', methods=['GET', 'POST'])
    def gettags():
        db = TagDB()
        if request.method == 'POST':
            images = request.json['images']
            print('got request for the following images:', images)
            return db.get_tags_all_images(images)

        return db.get_all_tags()

    @app.route('/getImages', methods=['POST'])
    def getimages():
        db = TagDB()

        tags = request.json.get('tags')
        excluded_tags = request.json.get('excludedTags')
        return db.get_images_by_tags(tags, excluded_tags)

    @app.route('/<path:path>')
    def static_file(path):
        return send_from_directory(static_dir, path)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='localhost', port=8080)
