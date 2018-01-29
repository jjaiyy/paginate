# -*- coding: utf-8 -*-
import datetime
import urlparse
import socket
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule


from scrapy.loader.processors import MapCompose, Join
from scrapy.loader import ItemLoader
from w3lib.html import remove_tags

from posts.items import PropertiesItem


class EasySpider(CrawlSpider):
    name = 'easy'
    allowed_domains = ['www.wikihow.com']
    start_urls = ['https://www.wikihow.com/wikiHowTo?search=book']

    rules = (
        Rule(LinkExtractor(restrict_xpaths='//a[contains(@class, "buttonright")]')),
        Rule(LinkExtractor(restrict_xpaths='//a[contains(@class, "result_link")]'), callback='parse_item')
    )

    def parse_item(self, response):
        l = ItemLoader(item=PropertiesItem(), response=response)

        # Housekeeping fields
        
        l.add_xpath('title', '//h1[contains(@class,"firstHeading")][1]', MapCompose(remove_tags))
        l.add_xpath('view', '//div[@id="sp_stats_box"][1]/div[3]/span/text()')
        l.add_xpath('updated', '//*[@id="sp_modified"][1]/@data-datestamp', MapCompose(remove_tags, unicode.strip))
        l.add_xpath('image_urls', '//img[@class="whcdn"][1]/@src')
        l.add_value('url', response.url)

        
        return l.load_item()
