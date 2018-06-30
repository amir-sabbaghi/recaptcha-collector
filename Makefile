SOURCES=manifest.json detector.js
RESOURCES=icons/*.png
OUTPUTS=$(patsubst %,dist/%,$(SOURCES) $(RESOURCES))

all: firefox

clean:
	rm -rf dist recaptcha.zip

dirs:
	mkdir -vp dist/icons

firefox: dirs
	GPPFLAGS+=-DTARGET_FIREFOX $(MAKE) build dist/background.js

chrome: dist build

build: $(OUTPUTS)
	cd dist && zip -r ../recaptcha.zip *

dist/icons/%.png: icons/%.png
	cp -v $^ dist/icons/

dist/%: %
	gpp $(GPPFLAGS) -o $@ $^

.PHONY: all clean dirs firefox chrome build

