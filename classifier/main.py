import signal
import sys

import server


def close_handler():
    server.stop()
    sys.exit(0)


if __name__ == '__main__':
    signal.signal(signal.SIGINT, close_handler)
    server.start()
    signal.pause()
