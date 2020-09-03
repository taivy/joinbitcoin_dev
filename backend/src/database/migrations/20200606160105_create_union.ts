import * as Knex from 'knex';


export async function up(knex: Knex) {
  return knex.raw(`create or replace view vw_ads as (
SELECT id, vendor, max_btc, min_btc, price, currency, payment_type, rating
  FROM external.localbitcoins_ad
UNION 
SELECT id, vendor, fiat_amount_range_min as max_btc, fiat_amount_range_max as min_btc, fiat_usd_price_per_btc as price, currency, payment_type, null as rating
  FROM external.paxful_ad
UNION 
SELECT id, vendor, null as max_btc, null as min_btc, amount as price, currency, null as payment_type, null as rating
  FROM external.coinbase_ad
);`);
}


export async function down(knex: Knex) {
  return knex.raw("drop view vw_ads;");
}
