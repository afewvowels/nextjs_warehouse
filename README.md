# Home Workshop Inventory Management System

[![CodeFactor](https://www.codefactor.io/repository/github/afewvowels/nextjs_warehouse/badge)](https://www.codefactor.io/repository/github/afewvowels/nextjs_warehouse)

This is an inventory management system that developed using Next.js with a NoSQL ~~mongodb~~ Firebase backend.

Font adjustments and palette swaps are available in the footer.

## Database Models

Bin | Prototype | Item
--- | --------- | ----
uuid | uuid | uuid
readable_name | readable_name | bin_uuid
name | name | prototype_uuid
description | description | image_uuid
icon | icon | in_bin
tinyurl | tag_uuids |
item_uuids | traits |
image_uuid | image_uuid |

Category | Tag | Image
-------- | --- | -----
uuid | uuid | uuid
name | category_uuid | base64
description | name | -
icon | description | -
- | icon | -

Palette | Font
------- | ----
uuid | uuid
hex0 | category
hex1 | css
color0 | link
color1 | name
- | weight0
- | weight1

