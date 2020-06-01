VERSION=`date +'%d_%m_%y'`

docker:
	@docker build -t mancas/mancas:aplanalacurva_$(VERSION) .
	@docker push mancas/mancas:aplanalacurva_$(VERSION)
	