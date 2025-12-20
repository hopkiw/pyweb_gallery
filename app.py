import webview
import sys

from tagdb import TagDB


class Api:
    def get_tags(self, images):
        db = TagDB()
        return db.get_tags_all_images(images)

    def get_all_tags(self):
        db = TagDB()
        return db.get_all_tags()

    def get_images(self, tags, excluded_tags):
        db = TagDB()
        return db.get_images_by_tags(tags, excluded_tags)

    def remove_tag_from_images(self, tag, images):
        db = TagDB()
        return db.remove_tag_from_images(tag, images)

    def create_tag(self, tag):
        db = TagDB()
        return db.add_tag(tag)

    def add_tag_to_images(self, tag, images):
        db = TagDB()
        return db.add_tag_to_images(tag, images)

    def rename_tag(self, old, new):
        print('got JS request: rename tag')
        db = TagDB()
        return db.rename_tag(old, new)


def main():
    dev = '--dev' in sys.argv
    window = webview.create_window('pywebview-gallery', 'http://localhost:5173' if dev else 'dist/index.html', js_api=Api())
    webview.settings['ALLOW_DOWNLOADS'] = dev
    webview.settings['REMOTE_DEBUGGING_PORT'] = 9222 if dev else None
    webview.settings['OPEN_DEVTOOLS_IN_DEBUG'] = False
    webview.start(debug=dev, gui='qt', private_mode=False)

    return window


if __name__ == "__main__":
    main()
