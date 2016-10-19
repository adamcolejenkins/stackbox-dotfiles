#!/bin/sh
#
# Atom.app and package instalelr

# Check for the Atom Package Manager
if test $(which apm)
then

	echo "  Installing Atom packages for you."
	apm install --packages-file $DOT/Atomfile

fi

exit 0