update src_corp
set market = regexp_replace(market, E';\ +', '|', 'g' ),
    tech = regexp_replace(tech, E';\ +', '|', 'g' ),
    business_model = regexp_replace(business_model, E';\ +', '|', 'g' )
