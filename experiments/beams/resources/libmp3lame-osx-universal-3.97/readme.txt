This is a pre-built Universal binary of libmp3lame from the
lame-3.97 distribution.

If you would like to rebuild it, you'll need Xcode and the
source from http://lame.sourceforge.net.

1)  Untar the source
2)  Change to the lame-3.97 directory
3)  Execute the script included in the tarball.

You'll find the newly built library, libmp3lame.dylib, in the lame-3.97
root directory.

NOTE: As written, the build script requires the 10.2.8 SDK and gcc 3.3 compiler
to be installed in addition to the 10.4 SDK and gcc 4.0 compiler.  This is to
provide compatibility back to 10.2 for the PPC architecture.

Also, it is meant to be run from a PPC based Mac.  Slight modifications will need
to be make to allow it to run on an Intel based Mac.

Included is a simple installer project that you can use to install the library
into /usr/local/lib.  You create the installer package with:

sudo /Developer/Tools/packagemaker -build -proj Lame\ Library\ v3.97\ Installer.pmproj -p ../Lame\ Library\ v3.97\ Installer.pkg
