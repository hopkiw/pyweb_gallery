import webview
import threading
import sys
from be.start import create_app


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
        "My App", url="http://localhost:8080", width=1400, height=850
    )
    webview.start(debug=('--debug' in sys.argv))


if __name__ == "__main__":
    print(sys.argv)
    main()
