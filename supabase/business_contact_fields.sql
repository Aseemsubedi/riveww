alter table public.businesses
add column if not exists contact_person text,
add column if not exists phone_number text,
add column if not exists whatsapp_number text,
add column if not exists address text;
