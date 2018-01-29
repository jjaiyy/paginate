from scrapy.item import Item, Field


class PropertiesItem(Item):
    # Primary fields
    title = Field()
    view = Field()
    updated = Field()
    image_urls = Field()
    link = Field()

    # Calculated fields
    images = Field()
    location = Field()

    # Housekeeping fields
    url = Field()
    project = Field()
    spider = Field()
    server = Field()
    date = Field()
