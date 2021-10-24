with cte as
(
    select
        coalesce(a.id, b.id, c.id, f.id, g.id, i.id, ir.id, p.id) as src_id,
        unnest(string_to_array(coalesce(a.services, b.services, null, f.service, g.services, i.services, ir.services, null), '|')) as market,
        s.id as serv_id
    from rs_services as s
        left join src_accs as a
            on a.obj_type = s.serv_type
                and a.id = s.src_serv_id
        left join src_binks as b
            on b.obj_type = s.serv_type
                and b.id = s.src_serv_id
        left join src_corp as c
            on c.id = s.src_serv_id
                and s.serv_type = 'Корпорации'
        left join src_funds as f
            on f.objtype = s.serv_type
                and f.id = s.src_serv_id
        left join src_gwp as g
            on g.obj_type = s.serv_type
                and g.id = s.src_serv_id
        left join src_inz as i
            on i.obj_type = s.serv_type
                and i.id = s.src_serv_id
        left join src_iras as ir
            on ir.obj_type = s.serv_type
                and ir.id = s.src_serv_id
        left join src_ppt as p
            on p.obj_type = s.serv_type
                and p.id = s.src_serv_id
)
insert into rs_service_doms
(
    serv_id,
    dom_id
)
select
    cte.serv_id,
    d.id as dom_id
from cte
    inner join rs_domains as d
        on d.val_type = 'ServMatrix'
            and d.rus_name = cte.market
where not exists
(
    select 1
    from rs_service_doms as sd
    where sd.serv_id = cte.serv_id
        and sd.dom_id = d.id
)