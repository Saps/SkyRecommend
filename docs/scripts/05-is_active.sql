with cte as
(
    select id, obj_type, date_close from src_accs
    union all select id, obj_type, date_close from src_binks
    union all select id, objtype, datazakr from src_funds
    union all select id, obj_type, date_close from src_gwp
    union all select id, obj_type, date_close from src_inz
    union all select id, obj_type, date_close from src_iras
    union all select id, obj_type, date_close from src_ppt
)
update rs_services as s
set is_active = case when d.date_close <= current_date then 0 else 1 end
from cte as c
    cross join lateral
    (
        select
            to_date
            (
                case
                    when length(c.date_close) < 5 then '01.01.' || c.date_close
                    else replace(c.date_close, '/', '.')
                end,
                'DD.MM.YYYY'
            ) as date_close
    ) as d
where c.obj_type = s.serv_type
    and c.id = s.src_serv_id