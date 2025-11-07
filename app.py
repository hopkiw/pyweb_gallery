import webview
import sys

from tagdb import TagDB


class Api:
    def get_tags(self, images):
        db = TagDB()
        print('got JS request get_tags(images=', images)
        return db.get_tags_all_images(images)

    def get_all_tags(self):
        db = TagDB()
        print('got JS request get_all_tags()')
        return db.get_all_tags()

    def get_images(self, tags, excluded_tags):
        db = TagDB()
        print(f'got JS request get_images(tags={tags}, excluded_tags={excluded_tags})')
        return db.get_images_by_tags(tags, excluded_tags)

    def remove_tag_from_images(self, tag, images):
        db = TagDB()
        print(f'got JS request remove_tag_from_images(tag={tag}, images={images})')
        return db.remove_tag_from_images(tag, images)

    def create_tag(self, tag):
        db = TagDB()
        print(f'got JS request create_tag({tag})')
        return db.add_tag(tag)

    def add_tag_to_images(self, tag, images):
        db = TagDB()
        print(f'got JS request add_tag_to_images(tag={tag}, images={images})')
        return db.add_tag_to_images(tag, images)


def main():
    dev = '--dev' in sys.argv
    window = webview.create_window('pywebview-react boilerplate', 'http://localhost:5173' if dev else 'dist/index.html', js_api=Api())
    webview.settings['ALLOW_DOWNLOADS'] = True
    webview.settings['REMOTE_DEBUGGING_PORT'] = 9222
    webview.settings['OPEN_DEVTOOLS_IN_DEBUG'] = False
    webview.start(debug=dev, gui='qt')

    return window


if __name__ == "__main__":
    main()
