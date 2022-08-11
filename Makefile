.PHONY: publish

publish:
	rsync -Lrh --progress --delete --stats . yavin:/srv/www/net.vladh.met
