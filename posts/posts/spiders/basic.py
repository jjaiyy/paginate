# -*- coding: utf-8 -*-
import datetime
import urlparse
import socket
import scrapy

from scrapy.loader.processors import MapCompose, Join
from scrapy.loader import ItemLoader
from w3lib.html import remove_tags

from posts.items import PropertiesItem


class BasicSpider(scrapy.Spider):
    name = 'basic'
    allowed_domains = ['wikihow.com']
    start_urls = ['https://www.wikihow.com/wikiHowTo?search=book']

    def parse(self, response):
        l = ItemLoader(item=PropertiesItem(), response=response)
        l.add_xpath('title', '//*[@class="result_link"][1]', MapCompose(remove_tags))
        l.add_xpath('view', '//*[@class="sr_view"][1]', MapCompose(remove_tags, unicode.strip))
        l.add_xpath('updated', '//*[@class="sr_updated"][1]', MapCompose(remove_tags, unicode.strip))
        l.add_xpath('image_urls', '//div[@class="result_thumb"][1]//img//@src')
        l.add_xpath('link', '//*[@class="result_link"][1]/@href')
        return l.load_item()
