from flask import (
    Flask,
    request,
    send_from_directory,
    render_template,
)
from flask_cors import CORS

from .tagdb import TagDB


def create_app():
    static_dir = 'ui/assets'
    app = Flask(__name__, static_folder=static_dir)
    app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
    CORS(app)

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/getTags')
    def gettags():
        db = TagDB()
        return db.get_all_tags()

    @app.route('/getImages', methods=["POST"])
    def getimages():
        db = TagDB()

        tag = request.json['tag']
        tag_id = db.get_tag(tag)
        return db.get_images_by_tag(tag_id)

    @app.route('/<path:path>')
    def static_file(path):
        return send_from_directory(static_dir, path)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='localhost', port=8080)
