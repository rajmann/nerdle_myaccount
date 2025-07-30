# Nerdle server functions

These are deployed as Lambda functions. They are required for Pro Nerdle and used to add some basic obfuscation to the puzzle passed in the URL.

See create.html in the nerdle-static repo to see how a custom solution is constructed.

## encodeSolution

This is used by pro create (create.html in the static-html website) to create an encoded solution which is passed on the pro game URL.

The solution is passed in the URL and is first AES encrypted and then base 64 encoded.

## decryptSolution

Used by pro.nerdlegame.com to decode a solution passed in the URL.

The solution is base 64 decoded and then AES unencrypted


