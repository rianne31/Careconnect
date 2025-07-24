from optparse import Values
from typing import List


def add_options(self) -> None:
    self.cmd_opts.add_option(
        "--clear-http-cache",
        action="store_true",
        help="Clear the HTTP cache."
    )
    self.cmd_opts.add_option(
        "--clear-wheel-cache",
        action="store_true",
        help="Clear the wheel cache."
    )
    

def run(self, options: Values, args: List[str]) -> int:
    if options.clear_http_cache:
        clear_http_cache()
    if options.clear_wheel_cache:
        clear_wheel_cache()
   

def clear_http_cache():
    # Logic to clear the HTTP cache
    pass

def clear_wheel_cache():
    # Logic to clear the wheel cache
    pass
