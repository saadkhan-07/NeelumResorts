-- Phase 7: describe every photograph, and name the place where it is certain.
--
-- Written by looking at each image. Keyed by Cloudinary public ID, so a photo used in
-- several places gets the same description everywhere. Touches only `alt`.
--
-- Place names are only used where they are true:
--   * every photo of the resort itself is in Taobat, on the Neelum River;
--   * the jeep photos do not show where they were taken, so they name no place;
--   * the two lakes are named Ratti Gali because the owner uploaded them to that tour.
--
-- Run once per database:  psql "<url>" -v ON_ERROR_STOP=1 -f prisma/data-fixes/2026-09-21-alt-text.sql

begin;

update public."Media" m
set alt = v.alt
from (values
  -- The resort, outside
  ('neelum/hero/whzamljl37ylghyeeviq',   'Neelum Resort Taobat: the balconied timber lodge above the lawn, green hills of Neelum Valley behind'),
  ('neelum/gallery/hero-2',              'Neelum Resort Taobat in evening light, the timber lodge above lawn seating and green hills'),
  ('neelum/misc/hero-2',                 'Neelum Resort Taobat in evening light, the timber lodge above lawn seating and green hills'),
  ('neelum/hero/yxz2ouwhwvvkvt10rtyf',   'The lawn at Neelum Resort Taobat, with pine forest and the Neelum River alongside'),
  ('neelum/misc/lwspyrkuuhtgmlhhczkz',   'The lawn at Neelum Resort Taobat, with pine forest and the Neelum River alongside'),
  ('neelum/gallery/cta',                 'The resort''s timber lodge and outside staircase beside the Neelum River in Taobat, pines behind'),
  ('neelum/misc/cta',                    'The resort''s timber lodge and outside staircase beside the Neelum River in Taobat, pines behind'),
  ('neelum/gallery/room-deluxe',         'Neelum Resort Taobat''s timber lodge with long balconies above the Neelum River'),
  ('neelum/gallery/tour-baboon',         'The resort''s timber lodge and lawn beside the Neelum River in Taobat on a clear day'),
  ('neelum/gallery/tour-rattigali',      'Neelum Resort Taobat beside the Neelum River under rain clouds, pine forest rising behind'),
  ('neelum/misc/tour-rattigali',         'Neelum Resort Taobat beside the Neelum River under rain clouds, pine forest rising behind'),
  ('neelum/gallery/room-family',         'The green-roofed lodge by the Neelum River in Taobat, rain clouds over the pines'),

  -- The resort, inside
  ('neelum/rooms/degdrc0a24gsk8tnuazi',  'Deluxe Riverside Room at Neelum Resort Taobat: a double bed in a cedar-lined room'),
  ('neelum/gallery/jeep-fleet',          'A double bed in a cedar room with warm light along the ceiling, Neelum Resort Taobat'),
  ('neelum/rooms/uaew55pnosppxtb4n4mc',  'Executive Valley Suite at Neelum Resort Taobat: two beds in cedar, windows on two sides'),
  ('neelum/rooms/hi1pbefobev5n5cle44e',  'Family Hut at Neelum Resort Taobat: two beds under a timber ceiling, a glass door onto the veranda'),
  ('neelum/gallery/kahwa',               'Two beds under a timber ceiling with a glass door onto the veranda, Neelum Resort Taobat'),
  ('neelum/gallery/hero-3',              'A twin room in cedar at Neelum Resort Taobat, windows on two sides looking into the pines'),
  ('neelum/gallery/tour-taobat',         'A cedar-lined room with two beds and morning sun across the floor, Neelum Resort Taobat'),
  ('neelum/gallery/g1',                  'A double bed in a cedar room with a wall of windows onto the pines, Neelum Resort Taobat'),
  ('neelum/gallery/g2',                  'A timber corridor with glass walls and a small seating area, Neelum Resort Taobat'),
  -- One bathroom photograph, used on all four rooms
  ('neelum/rooms/dx2mblzgfijudkcmwhfx',  'The attached bathroom, in cedar and black tile, with a shower and hot-water geyser'),
  ('neelum/rooms/gy0p4hkrvwd229yx6odc',  'The attached bathroom, in cedar and black tile, with a shower and hot-water geyser'),
  ('neelum/rooms/qiqkzu3rqmdnbjxqdfmq',  'The attached bathroom, in cedar and black tile, with a shower and hot-water geyser'),
  ('neelum/rooms/yc9sctwmayp0lvawyhgp',  'The attached bathroom, in cedar and black tile, with a shower and hot-water geyser'),

  -- Taobat
  ('neelum/gallery/room-riverside',               'A 4x4 jeep parked under the Welcome to Taobat sign on a snowy day in Taobat'),
  ('neelum/tours/room-riverside-taobat-valley',   'A 4x4 jeep parked under the Welcome to Taobat sign on a snowy day in Taobat'),

  -- Jeeps (place not shown, so not named)
  ('neelum/gallery/g7',                  'A white Toyota 4x4 on a rocky mountain track, snow on the slopes around it'),
  ('neelum/gallery/lounge',              'A silver Toyota 4x4 on a dirt track through a hillside village'),
  ('neelum/misc/lounge',                 'A silver Toyota 4x4 on a dirt track through a hillside village'),
  ('neelum/tours/lounge-arang-kel',      'A silver Toyota 4x4 on a dirt track through a hillside village'),
  ('neelum/tours/hero-1-baboon-valley',  'A man standing on the roof of a 4x4 in a green, pine-covered valley'),

  -- Ratti Gali (as uploaded to that tour by the owner)
  ('neelum/tours/phyosockvdks03w9rbhu',  'Turquoise Ratti Gali Lake reflecting snow-patched peaks under a summer sky'),
  ('neelum/tours/rogzufrdrhfdeb3u1jig',  'Ratti Gali Lake beneath dark ridges still streaked with snow')
) as v(public_id, alt)
where m."publicId" = v.public_id
  and m.placement <> 'BRAND';

commit;

-- Anything left without a description is printed here and should be empty.
select placement, "publicId" from public."Media" where alt = '' and placement <> 'BRAND';
