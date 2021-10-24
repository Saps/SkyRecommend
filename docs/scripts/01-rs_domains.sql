update rs_domains as d
set rus_name = regexp_replace(d.rus_name, E'[\\n\\r]+', '', 'g' )

with market as
(
    select distinct
        unnest(string_to_array(rynok, '|')) as rus_name
    from src_funds
)
insert into rs_domains
(
    rus_name,
    val_type
)
select
    market.rus_name,
    'Market' as val_type
from market
where not exists
(
    select 1
    from rs_domains as d
    where d.rus_name = market.rus_name
        and d.val_type = 'Market'
)

with techs as
(
    select distinct
        unnest(string_to_array(techs, '|')) as rus_name
    from src_funds
)
insert into rs_domains
(
    rus_name,
    val_type
)
select
    techs.rus_name,
    'Techs' as val_type
from techs
where not exists
(
    select 1
    from rs_domains as d
    where d.rus_name = techs.rus_name
       and d.val_type = 'Techs'
)

with study as
(
    select distinct
        unnest(string_to_array(study, '|')) as rus_name
    from src_funds
)
insert into rs_domains
(
    rus_name,
    val_type
)
select
    study.rus_name,
    'Study' as val_type
from study
where not exists
(
    select 1
    from rs_domains as d
    where d.rus_name = study.rus_name
       and d.val_type = 'Study'
)