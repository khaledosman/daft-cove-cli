## Installing the cli
You can either:
1. Create a symlink to the index.js file using ```npm link``` so you always have the latest version installed as you make changes to the code. (This is useful for devmode or people installing the cli by cloning the repository).

2. install once globally using ```npm install -g``` as if it was published on npm registry. If the files change or you do a git pull, you'll need to re-install it to get the latest version.

## Usage

```daft-cove --help```
prints out help information

```daft-cove -z <zip code> -s <sub total>```
runs the program.

The `-z` flag is an alias to `--zipCode` and the `-s` flag is an alias to `--subTotal`, so either can be used
