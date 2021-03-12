
# Open Access Checker

## Summary
Group 8 Open-Access Checker tool

## Team
James Deasley = 2nd Year ICS student

Nicholas Dempsey = 2nd Year ICS student

Kian Fay = 3rd Year ICS student

Kathleen Jones = 3rd Year ICS student

## Description
A website to help researchers and research groups to transition their publication planning, in particular adjusting to submitting to venues that are open access or that allow one to make a preprint version public.

## Current System


The Journal Checker Tool (JCT) is equipped to deal with a large chunk of the complexity involved with this project. We interact with the REST API by executing a GET request to the following url, filling in the query parameters:

`https://api.jct.cottagelabs.com/calculate?issn=[issn]&ror=[ror]&funder=[funder]`


This API can be further tested at this link (fill in at least two of the fields to get a result):

`https://journalcheckertool.org/`


And the GitHub Repo, which contains all the back-end and front-end code is here for reference:

`https://github.com/CottageLabs/jct`
