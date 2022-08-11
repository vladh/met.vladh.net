.PHONY: publish

publish:
	rsync --exclude '.git' -Lrh --progress --delete --stats . yavin:/srv/www/net.vladh.met
