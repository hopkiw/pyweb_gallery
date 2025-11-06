import webview
import threading
import sys

# from time import time

from be.start import create_app
from be.tagdb import TagDB


class Api:
    def fullscreen(self):
        webview.windows[0].toggle_fullscreen()

    def my_api(self, content):
        print('my_api got content:', content)
        return {'cheerio': 'mate'}

    def save_content(self, content):
        filename = webview.windows[0].create_file_dialog(webview.SAVE_DIALOG)
        if not filename:
            return

        with open(filename[0], 'w') as f:
            f.write(content)

    def get_tags(self, images):
        db = TagDB()
        print('got JS request get_tags(images=', images)
        return db.get_tags_all_images(images)

    def get_all_tags(self):
        db = TagDB()
        print('got JS request get_all_tags()')
        return db.get_all_tags()

    def get_images(self, options):
        tags, excluded_tags = options
        db = TagDB()
        print(f'got JS request get_images(tags={tags}, excluded_tags={excluded_tags})')
        return db.get_images_by_tags(tags, excluded_tags)

    def remove_tag_from_images(self, tag, images):
        # tag, images = options
        db = TagDB()
        print(f'got JS request remove_tag_from_images(tag={tag}, images={images})')
        return db.remove_tag_from_images(tag, images)
        # return len(images)

    def create_tag(self, tag):
        db = TagDB()
        print(f'got JS request create_tag({tag})')
        return db.add_tag(tag)

    def add_tag_to_images(self, tag, images):
        db = TagDB()
        print(f'got JS request add_tag_to_images(tag={tag}, images={images})')
        return db.add_tag_to_images(tag, images)


# def set_interval(interval):
#     def decorator(function):
#         def wrapper(*args, **kwargs):
#             stopped = threading.Event()
#
#             def loop():  # executed in another thread
#                 while not stopped.wait(interval):  # until stopped
#                     function(*args, **kwargs)
#
#             t = threading.Thread(target=loop)
#             t.daemon = True  # stop if the program exits
#             t.start()
#             return stopped
#         return wrapper
#     return decorator
#
#
# @set_interval(1)
# def update_ticker():
#     if len(webview.windows) > 0:
#         webview.windows[0].evaluate_js('window.pywebview.state && window.pywebview.state.set_ticker("%d")' % time())


def start_flask():
    try:
        # Start Flask server
        app = create_app()
        app.run(host="localhost", port=8080)
    except Exception as e:
        print(f"Backend startup failed: {str(e)}")
        sys.exit(1)


def main():
    flask_thread = threading.Thread(target=start_flask)
    flask_thread.daemon = True
    flask_thread.start()

    # webview.settings["ALLOW_DOWNLOADS"] = True
    webview.create_window(
        "My App", url="http://localhost:5173", width=1400, height=850
    )
    webview.start(debug=('--debug' in sys.argv))


def main_no_ui():
    start_flask()


def main_no_flask():
    window = webview.create_window('pywebview-react boilerplate', 'http://localhost:5173', js_api=Api())
    # window = webview.create_window('pywebview-react boilerplate', 'dist/index.html', js_api=Api())
    print('Created window', window)
    # webview.start(update_ticker, debug=True)
    webview.settings['ALLOW_DOWNLOADS'] = True
    webview.settings['REMOTE_DEBUGGING_PORT'] = 9222
    webview.settings['OPEN_DEVTOOLS_IN_DEBUG'] = False
    webview.start(debug=True, gui='qt')


if __name__ == "__main__":
    # main()
    # main_no_ui()
    main_no_flask()
