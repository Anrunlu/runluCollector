from datetime import timedelta


def new_private_clt(clt):
    """
    :param clt:collection对象
    :return msg对象
    """
    msg = {
        "title": "新收集任务",
        "btn_label": [
            {"title": "去提交", "url": f"https://up.anrunlu.net/collections/{clt['_id']}"},
            {"title": "忽略", "url": f"https://up.anrunlu.net/collections/{clt['_id']}"},
        ],
        "content": f"### 新收集任务\n![](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/runlucollector/public/README/20200806182130.png)\n- 标题：{clt['title']}\n- 收集者：{clt['creator'][0]['nickname']}\n- 截止时间：{clt['endtime']+timedelta(hours=8)}",
    }
    return msg


def new_public_clt(clt):
    """
    :param clt:collection对象
    :return msg对象
    """
    msg = {
        "title": "新公开征集",
        "btn_label": [
            {"title": "去提交", "url": f"https://up.anrunlu.net/collections/{clt['_id']}"},
            {"title": "忽略", "url": f"https://up.anrunlu.net/collections/{clt['_id']}"},
        ],
        "content": f"### 新公开征集\n![](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/runlucollector/public/README/20200806182553.png)\n- 标题：{clt['title']}\n- 征集者：{clt['creator'][0]['nickname']}\n- 截止时间：{clt['endtime']+timedelta(hours=8)}",
    }
    return msg


def remind_public_clt(clt):
    """
    :param clt:collection对象
    :return msg对象
    """
    msg = {
        "title": "征集者提醒",
        "btn_label": [
            {"title": "去看看", "url": f"https://up.anrunlu.net/collections/{clt['_id']}"},
            {"title": "忽略", "url": f"https://up.anrunlu.net/collections/{clt['_id']}"},
        ],
        "content": f"### 征集者提醒\n![](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/runlucollector/public/README/20200807080132.png)\n- 标题：{clt['title']}\n- 征集者：{clt['creator'][0]['nickname']}\n- 截止时间：{clt['endtime']+timedelta(hours=8)}",
    }
    return msg


def remind_private_clt(clt):
    """
    :param clt:collection对象
    :return msg对象
    """
    msg = {
        "title": "收集者提醒",
        "btn_label": [
            {"title": "去提交", "url": f"https://up.anrunlu.net/collections/{clt['_id']}"},
            {"title": "忽略", "url": f"https://up.anrunlu.net/collections/{clt['_id']}"},
        ],
        "content": f"### 收集者提醒\n![](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/runlucollector/public/README/20200807080132.png)\n- 标题：{clt['title']}\n- 征集者：{clt['creator'][0]['nickname']}\n- 截止时间：{clt['endtime']+timedelta(hours=8)}",
    }
    return msg


def nearly_end_private_clt(clt):
    """
    :param clt:collection对象
    :return msg对象
    """
    msg = {
        "title": "收集任务即将截止",
        "btn_label": [
            {
                "title": "查看详情",
                "url": f"https://up.anrunlu.net/collections/{clt['_id']}",
            },
            {"title": "去提交", "url": f"https://up.anrunlu.net/collections/{clt['_id']}"},
        ],
        "content": f"### 一个收集任务即将截止\n![](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/runlucollector/public/README/20200806201923.png)\n- 标题：{clt['title']}\n- 收集者：{clt['creator'][0]['nickname']}\n- 截止时间：{clt['endtime']+timedelta(hours=8)}",
    }
    return msg


def nearly_end_public_clt(clt):
    """
    :param clt:collection对象
    :return msg对象
    """
    msg = {
        "title": "征集即将截止",
        "btn_label": [
            {
                "title": "查看详情",
                "url": f"https://up.anrunlu.net/collections/{clt['_id']}",
            },
            {"title": "去提交", "url": f"https://up.anrunlu.net/collections/{clt['_id']}"},
        ],
        "content": f"### 一个征集即将截止\n![](https://runlusiteplc.oss-cn-qingdao.aliyuncs.com/images/runlucollector/public/README/20200806201923.png)\n- 标题：{clt['title']}\n- 征集者：{clt['creator'][0]['nickname']}\n- 截止时间：{clt['endtime']+timedelta(hours=8)}",
    }
    return msg

