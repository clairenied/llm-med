-- CreateIndex
CREATE INDEX "Manuscript_title_idx" ON "public"."Manuscript"("title");

-- CreateIndex
CREATE INDEX "Manuscript_createdAt_idx" ON "public"."Manuscript"("createdAt");

-- CreateIndex
CREATE INDEX "ManuscriptSource_url_idx" ON "public"."ManuscriptSource"("url");

-- CreateIndex
CREATE INDEX "ManuscriptSource_externalId_idx" ON "public"."ManuscriptSource"("externalId");

-- CreateIndex
CREATE INDEX "ManuscriptSource_doi_idx" ON "public"."ManuscriptSource"("doi");
