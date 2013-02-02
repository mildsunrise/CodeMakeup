# This script is to be run in FontForge to import the
# images into glyphs and maybe apply other modifications to them.

# FontForge has weird behaviour when importing
# multiple bitmaps, so this script is necessary.

srcdir = '/tmp/glyphs'

from os import path
import fontforge as ff

font = ff.activeFont()
for i in xrange(0xf000, 0xf1a3):
  file = path.join(srcdir, 'uni%04X.png' % i)
  glyph = font.createChar(i)
  
  # Import image
  glyph.importOutlines(file)
  
  #FIXME: fix up

